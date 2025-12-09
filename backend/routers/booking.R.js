const express = require('express');
const router = express.Router();
const { bookSeats, createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/booking.C');

router.post('/book', bookSeats);
router.post('/create-order', createRazorpayOrder);
router.post('/verify-payment', verifyRazorpayPayment);
router.get("/:show_id", async (req, res) => {
  const { show_id } = req.params;
  const seats = await ShowSeat.findAll({ where: { show_id } });
  res.json(seats);
});

module.exports = router;
