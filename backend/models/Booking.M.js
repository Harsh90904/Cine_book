const sequelize = require("../config/DB");
const { DataTypes } = require('sequelize');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  show_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('confirmed', 'pending', 'cancelled'),
    defaultValue: 'pending',
  },
  payment_method: {
    type: DataTypes.STRING,
    defaultValue: 'online',
  },
},{
  tableName: 'booking',
  timestamps: true,
  underscored: true
});

module.exports = Booking 