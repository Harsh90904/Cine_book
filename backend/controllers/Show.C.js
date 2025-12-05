const sequelize = require('../config/DB');
  const Show = require('../models/Show.M');
  const Screen = require('../models/Screen.M');
  const Movie = require('../models/movie.M');
  const ShowSeat = require('../models/ShowSeat.M');

// const addShow = async (req, res) => {
  

//   const t = await sequelize.transaction();
//   try {
//     const { thater_id, screen_id, movie_id, start_time, end_time, ticket_price, status } = req.body;
//     if (!screen_id || !movie_id || !start_time || ticket_price === undefined) {
//       await t.rollback();
//       return res.status(400).json({ message: "screen_id, movie_id, start_time and ticket_price are required" });
//     }
//     console.log("Creating show with:", req.body);
//     const screen = await Screen.findByPk(screen_id, { transaction: t });
//     if (!screen) {
//       await t.rollback();
//       return res.status(404).json({ message: "Screen not found" });
//     }
//     console.log("Found screen:", screen.toJSON());
//     const movie = await Movie.findByPk(movie_id, { transaction: t });
//     if (!movie) {
//       await t.rollback();
//       return res.status(404).json({ message: "Movie not found" });
//     }
//     console.log("Found movie:", movie.toJSON());
//     const show = await Show.create({
//       screen_id,
//       movie_id,
//       thater_id: thater_id || screen.thater_id,
//       start_time: new Date(start_time),
//       end_time: end_time ? new Date(end_time) : null,
//       ticket_price: parseInt(ticket_price, 10),
//       status: status || "active",
//     }, { transaction: t });
//     console.log("Created show:", show.toJSON());
//     // create seats for show
//     // const seats = [];
//     // const seatCount = parseInt(screen.seat_count, 10) || 0;
//     // for (let i = 1; i <= seatCount; i++) {
//     //   seats.push({ show_id: show.id, seat_number: i, is_available: true });
//     // }
//     // if (seats.length){ await ShowSeat.bulkCreate(seats, { transaction: t });}
//     // console.log(`Created ${seats.length} seats for show ${show.id}`);
//     // await t.commit();

//     const showWithDetails = await Show.findByPk(show.id, {
//       include: [
//         {   attributes: ['id', 'name', 'seat_count', 'type'] },
//         { model: Movie, as: 'movie', attributes: ['id', 'title', 'duration', 'genre'] },
//       ],
//     });
//     console.log("Returning show with details:", showWithDetails.toJSON());
//     return res.status(201).json({ message: "Show created", show: showWithDetails });
//   } catch (error) {
//     console.error("Add Show Error:", error);
//     try { await t.rollback(); } catch (e) { /* ignore */ }
//     return res.status(500).json({ message: error.message || "Internal Server Error" });
//   }
// };
const addShow = async (req, res) => {
  try {
    const { thater_id, screen_id, movie_id, start_time, end_time, ticket_price, status } = req.body;

    if (!screen_id || !movie_id || !start_time || !ticket_price) {
      return res.status(400).json({ message: "screen_id, movie_id, start_time & ticket_price required" });
    }

    const show = await Show.create({
      screen_id,
      movie_id,
      thater_id,
      start_time,
      end_time: end_time || null,
      ticket_price,
      status: status || "active",
    });

    // const showDetails = await Show.findByPk(show.id, {
    //   include: [
    //     { model: Screen, as: "screen" },
    //     { model: Movie, as: "movie" }
    //   ]
    // });

    res.status(201).json({ message: "Show created", show });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
const getShowsByTheater = async (req, res) => {

  try {
    const { id } = req.params;
    const shows = await Show.findAll({
      where: { thater_id: id },
      
      order: [['start_time', 'DESC']],
    });
    return res.status(200).json(shows);
  } catch (error) {
    console.error("Get Shows Error:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const getShowById = async (req, res) => {

  try {
    const { id } = req.params;
    const show = await Show.findByPk(id,
  );
    if (!show) return res.status(404).json({ message: "Show not found" });
    return res.status(200).json(show);
  } catch (error) {
    console.error("Get Show Error:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const updateShow = async (req, res) => {

  try {
    const { id } = req.params;
    const { screen_id, movie_id, start_time, end_time, ticket_price, status } = req.body;

    const show = await Show.findByPk(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    // optional: validate new screen/movie exist
    if (screen_id) {
      const screen = await Screen.findByPk(screen_id);
      if (!screen) return res.status(404).json({ message: "New screen not found" });
    }
    if (movie_id) {
      const movie = await Movie.findByPk(movie_id);
      if (!movie) return res.status(404).json({ message: "New movie not found" });
    }

    await show.update({
      screen_id: screen_id || show.screen_id,
      movie_id: movie_id || show.movie_id,
      start_time: start_time ? new Date(start_time) : show.start_time,
      end_time: end_time ? new Date(end_time) : show.end_time,
      ticket_price: ticket_price !== undefined ? parseInt(ticket_price, 10) : show.ticket_price,
      status: status || show.status,
    });

    const updated = await Show.findByPk(id, {
      include: [
        { model: Screen, as: 'screen', attributes: ['id', 'name', 'seat_count'] },
        { model: Movie, as: 'movie', attributes: ['id', 'title'] },
      ],
    });

    return res.status(200).json({ message: "Show updated", show: updated });
  } catch (error) {
    console.error("Update Show Error:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const deleteShow = async (req, res) => {
  const Show = require('../models/Show.M');
  const ShowSeat = require('../models/ShowSeat.M');

  try {
    const { id } = req.params;
    const show = await Show.findByPk(id);
    if (!show) return res.status(404).json({ message: "Show not found" });

    // remove related seats then show
    await ShowSeat.destroy({ where: { show_id: id } });
    await show.destroy();

    return res.status(200).json({ message: "Show deleted" });
  } catch (error) {
    console.error("Delete Show Error:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const getShowSeats = async (req, res) => {

  try {
    const { id } = req.params;
    const seats = await ShowSeat.findAll({
      where: { show_id: id },
      order: [['seat_number', 'ASC']],
    });
    return res.status(200).json(seats);
  } catch (error) {
    console.error("Get Show Seats Error:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
const getShowsByMovie = async (req, res) => {
  const Show = require('../models/Show.M');
  const Screen = require('../models/Screen.M');
  const Theater = require('../models/Thater.M');

  try {
    const { movieId } = req.params;
    console.log("Fetching shows for movie:", movieId);

    const shows = await Show.findAll({
      where: { movie_id: movieId },
      order: [['start_time', 'ASC']],
    });
    console.log("Shows fetched:", shows);
    console.log("Found shows:", shows.length);
    return res.status(200).json(shows);
  } catch (error) {
    console.error("Get Shows by Movie Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  addShow,
  getShowsByTheater,
  getShowById,
  updateShow,
  deleteShow,
  getShowSeats,
  getShowsByMovie
};