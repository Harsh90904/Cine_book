const express = require('express');
const router = express.Router();
const { bookSeats } = require('../controllers/booking.C');

router.post('/book', bookSeats);

module.exports = router;
