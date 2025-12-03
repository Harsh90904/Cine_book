const express = require('express');
const router = express.Router();
const { bookSeats, createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/booking.C');

// reserve seats and create a pending booking
router.post('/book', bookSeats);

// create razorpay order for a pending booking
router.post('/create-order', createRazorpayOrder);

// verify razorpay payment (called by frontend after payment)
router.post('/verify-payment', verifyRazorpayPayment);
router.get("/:show_id", async (req, res) => {
  const { show_id } = req.params;
  const seats = await ShowSeat.findAll({ where: { show_id } });
  res.json(seats);
});

module.exports = router;
