const express = require('express');
const router = express.Router();
const { createScreenWithSeats } = require('../controllers/seat.C');

router.post('/create-screen', createScreenWithSeats);

module.exports = router;
