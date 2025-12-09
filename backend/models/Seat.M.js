const sequelize = require("../config/DB");
const { DataTypes } = require('sequelize');

const Seat = sequelize.define('Seat', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  screen_id: DataTypes.UUID,
  row: DataTypes.STRING,
  number: DataTypes.INTEGER,
  type: DataTypes.ENUM('GOLD', 'SILVER', 'PLATINUM'),
  status: DataTypes.ENUM('AVAILABLE', 'BOOKED', 'HOLD'),
  price: DataTypes.INTEGER
},{
  tableName: 'Seat',
  timestamps: true,
  underscored: true
});


module.exports = Seat;