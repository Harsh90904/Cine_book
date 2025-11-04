const Thater = require("../models/Thater.M");
const Screen = require("../models/Screen.M");
const Show = require("../models/Show.M");
const Movie = require("../models/movie.M");

// Add a theater
const addThater = async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      pincode,
      contact_number,
      email,
      total_screens = 0,
      total_seats = 0,
      seat_layout = null,
      amenities = null,
    } = req.body;

    if (!name || !city) {
      return res.status(400).json({ message: "name and city are required" });
    }

    // Handle uploaded images (multer stores files on disk)
    let images = null;
    if (req.files && req.files.length) {
      images = req.files.map(f => {
        // store relative URL path for frontend consumption
        return `/uploads/theaters/${f.filename}`;
      });
    }

    const newThater = await Thater.create({
      name,
      address,
      city,
      state,
      pincode,
      contact_number,
      email,
      total_screens,
      total_seats,
      seat_layout,
      amenities,
      images,
    });

    return res.status(201).json(newThater);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all theaters
const getAllThaters = async (req, res) => {
  try {
    const thaters = await Thater.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json(thaters);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get single theater by id (include screens)
const getThaterById = async (req, res) => {
  try {
    const { id } = req.params;
    const thater = await Thater.findByPk(id, {
      include: [{ model: Screen, as: "screens" }],
    });
    if (!thater) return res.status(404).json({ message: "Theater not found" });
    return res.status(200).json(thater);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update theater
const updateThater = async (req, res) => {
  try {
    const { id } = req.params;
    const thater = await Thater.findByPk(id);
    if (!thater) return res.status(404).json({ message: "Theater not found" });

    await thater.update(req.body);
    return res.status(200).json({ message: "Theater updated", thater });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete theater
const deleteThater = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Thater.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Theater not found" });
    return res.status(200).json({ message: "Theater deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get screens for a theater
const getScreensByThater = async (req, res) => {
  try {
    const { id } = req.params;
    const screens = await Screen.findAll({ where: { theater_id: id } });
    return res.status(200).json(screens);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Add a screen to a theater
const addScreenToThater = async (req, res) => {
  try {
    const { id } = req.params; // theater id
    const thater = await Thater.findByPk(id);
    if (!thater) return res.status(404).json({ message: "Theater not found" });

    const { name, seat_count = 0, seat_map = null, type = "2D", is_active = true } = req.body;
    if (!name) return res.status(400).json({ message: "screen name is required" });

    const screen = await Screen.create({
      theater_id: id,
      name,
      seat_count,
      seat_map,
      type,
      is_active,
    });

    // Optionally update theater total_screens / total_seats
    const totalScreens = (thater.total_screens || 0) + 1;
    const totalSeats = (thater.total_seats || 0) + (seat_count || 0);
    await thater.update({ total_screens: totalScreens, total_seats: totalSeats });

    return res.status(201).json({ message: "Screen added", screen });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all shows for a theater (across screens)
const getShowsByThater = async (req, res) => {
  try {
    const { id } = req.params;
    const shows = await Show.findAll({
      where: { theater_id: id },
      include: [{ model: Movie, as: "movie" }],
      order: [["start_time", "ASC"]],
    });
    return res.status(200).json(shows);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  addThater,
  getAllThaters,
  getThaterById,
  updateThater,
  deleteThater,
  getScreensByThater,
  addScreenToThater,
  getShowsByThater,
};