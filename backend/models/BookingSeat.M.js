const sequelize = require("../config/DB");
const { DataTypes } = require('sequelize');
  const BookingSeat = sequelize.define('BookingSeat', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
  },{
  tableName: 'bookingSeat',
  timestamps: true,
  underscored: true
});

module.exports = BookingSeat
