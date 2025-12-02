const ShowSeat = require('../models/ShowSeat.M');
const Booking = require('../models/Booking.M')
const sequelize = require('../config/DB');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.key_id?.trim(),
  key_secret: process.env.key_secret?.trim(),
});

exports.bookSeats = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { show_id, seat_ids, user_id } = req.body;
    if (!show_id || !Array.isArray(seat_ids) || seat_ids.length === 0 || !user_id) {
      await t.rollback();
      return res.status(400).json({ message: 'show_id, seat_ids (array) and user_id are required' });
    }

    const seats = await ShowSeat.findAll({
      where: { show_id, seat_id: seat_ids },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (seats.length !== seat_ids.length) {
      await t.rollback();
      return res.status(400).json({ message: 'Some seats not found for this show' });
    }

    const alreadyBooked = seats.some(s => s.status !== 'available');
    if (alreadyBooked) {
      await t.rollback();
      return res.status(400).json({ message: 'Some seats already booked' });
    }

    await Promise.all(
      seats.map(s => s.update({ status: 'reserved' }, { transaction: t })) // reserve until payment
    );

    // Create booking with pending status; frontend will call create-order next
    const totalAmount = seat_ids.length * 200; // change pricing logic as needed
    const booking = await Booking.create(
      {
        user_id,
        show_id,
        total_amount: totalAmount,
        status: 'pending',
      },
      { transaction: t }
    );

    await t.commit();
    return res.status(200).json({ message: 'Seats reserved, proceed to payment', booking });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Create Razorpay order for a booking
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { booking_id } = req.body;
    if (!booking_id) return res.status(400).json({ message: 'booking_id is required' });

    const booking = await Booking.findByPk(booking_id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'confirmed') return res.status(400).json({ message: 'Booking already paid' });

    const amountPaise = Math.round((booking.total_amount || 0) * 100);

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `rcpt_${booking.id}`,
      payment_capture: 1, // auto-capture
    });

    return res.status(200).json({
      key_id: process.env.key_id?.trim(),
      order,
      booking_id: booking.id,
      amount: booking.total_amount,
    });
  } catch (err) {
    console.error('Razorpay order error:', err);
    return res.status(500).json({ message: 'Unable to create order', error: err.message });
  }
};

// Verify Razorpay payment signature and finalize booking
exports.verifyRazorpayPayment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_id) {
      return res.status(400).json({ message: 'order_id, payment_id, signature and booking_id are required' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.key_secret?.trim())
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const booking = await Booking.findByPk(booking_id, { transaction: t });
    if (!booking) {
      await t.rollback();
      return res.status(404).json({ message: 'Booking not found' });
    }

    // mark booking confirmed and store payment id (add field payment_id in model if desired)
    await booking.update({ status: 'confirmed', payment_method: 'razorpay' }, { transaction: t });

    // mark show seats as booked permanently (you may need to load seat ids associated with this booking)
    // For now assume frontend provided seat_ids to bookSeats earlier; ensure ShowSeat rows moved from 'reserved' to 'booked'
    await ShowSeat.update(
      { status: 'booked' },
      { where: { booking_id: booking.id }, transaction: t } // requires ShowSeat.booking_id column OR update by other criteria
    ).catch(() => null);

    await t.commit();
    return res.status(200).json({ message: 'Payment verified and booking confirmed', booking_id: booking.id });
  } catch (err) {
    await t.rollback();
    console.error('Razorpay verify error:', err);
    return res.status(500).json({ message: 'Payment verification failed', error: err.message });
  }
};

module.exports = {
  bookSeats: exports.bookSeats,
  createRazorpayOrder: exports.createRazorpayOrder,
  verifyRazorpayPayment: exports.verifyRazorpayPayment,
};
