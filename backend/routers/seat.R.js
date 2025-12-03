const express = require('express');
const router = express.Router();
const { createScreenWithSeats,getShowSeats } = require('../controllers/seat.C');
router.post('/create-screen', createScreenWithSeats);
router.get("/:show_id",getShowSeats);
module.exports = router;
