const Seat  = require('../models/Seat.M');
const Screen = require('../models/Screen.M')
const sequelize = require('../config/DB');
const Theater = require('../models/Thater.M');

function rowLabel(n) {
  let label = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    label = String.fromCharCode(65 + rem) + label;
    n = Math.floor((n - 1) / 26);
  }
  return label;
}

exports.createScreenWithSeats = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, thater_id, rows = 10, cols = 12 } = req.body;

    if (!name || !thater_id) {
      await t.rollback();
      return res.status(400).json({ error: 'name and thater_id are required' });
    }

    // validate numeric rows/cols
    const rCount = parseInt(rows, 10);
    const cCount = parseInt(cols, 10);
    if (Number.isNaN(rCount) || Number.isNaN(cCount) || rCount <= 0 || cCount <= 0) {
      await t.rollback();
      return res.status(400).json({ error: 'rows and cols must be positive integers' });
    }

    // ensure theater exists
    const th = await Theater.findByPk(thater_id);
    if (!th) {
      await t.rollback();
      return res.status(404).json({ error: 'Theater not found' });
    }

    // create screen
    const screen = await Screen.create({ name, thater_id }, { transaction: t });

    // prepare seats
    const seatData = [];
    for (let r = 1; r <= rCount; r++) {
      const row = rowLabel(r);
      for (let c = 1; c <= cCount; c++) {
        seatData.push({
          seat_number: `${row}${c}`,
          row,
          type: r <= 2 ? 'VIP' : 'Regular',
          screen_id: screen.id,
        });
      }
    }

    // bulk create seats in transaction
    const seats = await Seat.bulkCreate(seatData, { transaction: t });

    // optionally update theater totals
    await th.update(
      {
        total_screens: (th.total_screens || 0) + 1,
        total_seats: (th.total_seats || 0) + seats.length,
      },
      { transaction: t }
    );

    await t.commit();
    return res.status(201).json({
      message: 'Screen and seats created',
      screen,
      seatsCreated: seats.length,
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
exports.getShowSeats = async (req, res) => {
  try {
    const { show_id } = req.params;
    if (!show_id) return res.status(400).json({ error: 'show_id is required' });

    const seats = await ShowSeat.findAll({ where: { show_id } });
    return res.json(seats);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};