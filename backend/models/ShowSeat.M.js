// backend/models/ShowSeat.M.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB');

const ShowSeat = sequelize.define('ShowSeat', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  show_id: { type: DataTypes.UUID, allowNull: false },
  seat_number: { type: DataTypes.INTEGER, allowNull: false },
  is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'show_seats',
  timestamps: false,
  underscored: true
});

module.exports = ShowSeat;
