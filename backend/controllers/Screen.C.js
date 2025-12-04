const Screen = require('../models/Screen.M');
const Theater = require('../models/Thater.M');

// Add screen to theater
const addScreen = async (req, res) => {
  try {
    const { thater_id, name, seat_count, type, is_active } = req.body;
    const { id } = req.params;

    const thaterId = thater_id || id;

    if (!thaterId || !name || !seat_count) {
      return res.status(400).json({ 
        message: "Theater ID, screen name, and seat count are required" 
      });
    }

    // Verify theater exists
    const theater = await Theater.findByPk(thaterId);
    if (!thaterId) {
      return res.status(404).json({ message: "Theater not found" });
    }

    const screen = await Screen.create({
      thater_id: thaterId,
      name,
      seat_count: parseInt(seat_count),
      type: type || '2D',
      is_active: is_active !== false,
    });

    res.status(201).json({
      message: "Screen added successfully",
      screen,
    });
  } catch (error) {
    console.error("Add Screen Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all screens for a theater
const getScreensByTheaterId = async (req, res) => {
  try {
    const { id } = req.params;

    const screens = await Screen.findAll({
      where: { thater_id: id },
      order: [['created_at', 'ASC']],
    });

    res.status(200).json(screens);
  } catch (error) {
    console.error("Get Screens Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single screen
const getScreenById = async (req, res) => {
  try {
    const { id } = req.params;

    const screen = await Screen.findByPk(id);
    if (!screen) {
      return res.status(404).json({ message: "Screen not found" });
    }

    res.status(200).json(screen);
  } catch (error) {
    console.error("Get Screen Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update screen
const updateScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, seat_count, type, is_active } = req.body;

    const screen = await Screen.findByPk(id);
    if (!screen) {
      return res.status(404).json({ message: "Screen not found" });
    }

    await screen.update({
      name: name || screen.name,
      seat_count: seat_count || screen.seat_count,
      type: type || screen.type,
      is_active: is_active !== undefined ? is_active : screen.is_active,
    });

    res.status(200).json({
      message: "Screen updated successfully",
      screen,
    });
  } catch (error) {
    console.error("Update Screen Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete screen
const deleteScreen = async (req, res) => {
  try {
    const { id } = req.params;

    const screen = await Screen.findByPk(id);
    if (!screen) {
      return res.status(404).json({ message: "Screen not found" });
    }

    await screen.destroy();

    res.status(200).json({
      message: "Screen deleted successfully",
    });
  } catch (error) {
    console.error("Delete Screen Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addScreen,
  getScreensByTheaterId,
  getScreenById,
  updateScreen,
  deleteScreen,
};