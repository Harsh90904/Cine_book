const { ShowSeat, Booking } = require('../models');
const sequelize = require('../config/DB');

exports.bookSeats = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { show_id, seat_ids, user_id } = req.body;
    if (!show_id || !Array.isArray(seat_ids) || seat_ids.length === 0 || !user_id) {
      await t.rollback();
      return res.status(400).json({ message: 'show_id, seat_ids (array) and user_id are required' });
    }

    // Lock selected show seats for update to prevent race conditions
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

    // Mark seats as booked
    await Promise.all(
      seats.map(s => s.update({ status: 'booked' }, { transaction: t }))
    );

    // Create booking
    const totalAmount = seat_ids.length * 200; // adjust pricing logic as needed
    const booking = await Booking.create(
      {
        user_id,
        show_id,
        total_amount: totalAmount,
        status: 'confirmed',
      },
      { transaction: t }
    );

    await t.commit();
    return res.status(200).json({ message: 'Booking confirmed', booking });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
