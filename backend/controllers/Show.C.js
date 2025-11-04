const { Show, Seat, ShowSeat } = require('../models');
const sequelize = require('../config/DB');

exports.createShow = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { movie_id, screen_id, start_time, date } = req.body;
    if (!movie_id || !screen_id || !start_time) {
      await t.rollback();
      return res.status(400).json({ error: 'movie_id, screen_id and start_time are required' });
    }

    const show = await Show.create(
      { movie_id, screen_id, start_time, date },
      { transaction: t }
    );

    // Auto-link all screen seats with this show
    const seats = await Seat.findAll({ where: { screen_id }, transaction: t });
    const showSeats = seats.map((seat) => ({
      show_id: show.id,
      seat_id: seat.id,
      status: 'available',
    }));

    if (showSeats.length) {
      await ShowSeat.bulkCreate(showSeats, { transaction: t });
    }

    await t.commit();
    return res.status(201).json({ message: 'Show created with seats', show });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
