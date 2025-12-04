const Thater = require('../models/Thater.M');
const Screen = require('../models/Screen.M');
const Show = require('../models/Show.M');
const Movie = require('../models/movie.M');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Thater Signup
const thaterSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      contact_number,
      address,
      city,
      state,
      pincode,
      total_screens = 0,
      total_seats = 0,
    } = req.body;
    console.log("Received Signup Data:", req.body);
    if (!name || !email || !password || !city) {
      return res.status(400).json({ message: 'name, email, password, city required' });
    }

    const existThater = await Thater.findOne({ where: { email } });
    if (existThater) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    console.log("Hashing password");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Defensive handling of uploaded files: ensure req.files is an array before mapping
    let imagesArr = [];
    if (req.files && Array.isArray(req.files) && req.files.length) {
      imagesArr = req.files
        .map((f) => {
          return `/uploads/thater/${f.filename || (f.path && f.path.split(/[\\/]/).pop()) || ''}`;
        })
        .filter(Boolean);
    }

    // parse seat_layout if provided (could be JSON string from client)
    let seatLayout = null;
    if (req.body.seat_layout) {
      try {
        seatLayout = typeof req.body.seat_layout === 'string' ? JSON.parse(req.body.seat_layout) : req.body.seat_layout;
      } catch (e) {
        // fallback: keep raw value if parse fails
        seatLayout = req.body.seat_layout;
      }
    }

    console.log("Creating Theater record");
    const thater = await Thater.create({
      name,
      email,
      password: hashedPassword,
      contact_number,
      address,
      city,
      state,
      pincode,
      total_screens,
      total_seats,
    
      seat_layout: seatLayout || null,
      images: imagesArr.length ? imagesArr : null,
    });
    console.log("Created Theater:", thater);
    const token = jwt.sign({ id: thater.id, role: 'thater' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Theater registered successfully',
      token,
      user: { id: thater.id, name, email, role: 'thater' },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Thater Login
const thaterLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password required' });
    }

    const thater = await Thater.findOne({ where: { email } });
    if (!thater) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // const isPasswordValid = await bcrypt.compare(password, thater.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({ message: 'Invalid email or password' });
    // }

    const token = jwt.sign({ id: thater.id, role: 'thater' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: thater.id, name: thater.name, email: thater.email, role: 'thater' },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

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

    // Defensive handling of uploaded images
    let imagesArr = [];
    if (req.files && Array.isArray(req.files) && req.files.length) {
      imagesArr = req.files
        .map((f) => `/uploads/thater/${f.filename || (f.path && f.path.split(/[\\/]/).pop()) || ''}`)
        .filter(Boolean);
    }

    // parse seat_layout if provided
    let seatLayout = null;
    if (req.body.seat_layout) {
      try {
        seatLayout = typeof req.body.seat_layout === 'string' ? JSON.parse(req.body.seat_layout) : req.body.seat_layout;
      } catch {
        seatLayout = req.body.seat_layout;
      }
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
      seat_layout: seatLayout || null,
      amenities,
      images: imagesArr.length ? imagesArr : null,
    });

    return res.status(201).json(newThater);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all thater
const getAllThaters = async (req, res) => {
  try {
    const thaters = await Thater.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    return res.json(thaters);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single theater by id (include screens)
const getThaterById = async (req, res) => {
  try {
    const { id } = req.params;
    const thater = await Thater.findByPk(id, {
      attributes: { exclude: ['password'] },
      // include: [{ model: Screen, as: 'screens' }],
    });
    if (!thater) return res.status(404).json({ message: 'Theater not found' });
    return res.json(thater);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update theater
const updateThater = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const thater = await Thater.findByPk(id);
    if (!thater) return res.status(404).json({ message: 'Theater not found' });

    await thater.update(updates);
    return res.json({ message: 'Theater updated', thater });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete theater
const deleteThater = async (req, res) => {
  try {
    const { id } = req.params;
    const thater = await Thater.findByPk(id);
    if (!thater) return res.status(404).json({ message: 'Theater not found' });

    await thater.destroy();
    return res.json({ message: 'Theater deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get screens for a theater
const getScreensByThater = async (req, res) => {
  try {
    const { id } = req.params;
    const screens = await Screen.findAll({ where: { thater_id: id } });
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
      thater_id: id,
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
      where: { thater_id: id },
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
  thaterSignup,
  thaterLogin,
};