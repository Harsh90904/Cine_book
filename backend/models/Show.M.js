const { DataTypes, DATE } = require('sequelize');
const sequelize = require('../config/DB');

const Show = sequelize.define('Show', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull:false
  },
  thater_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  screen_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  movie_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  ticket_price: DataTypes.INTEGER,
  language: DataTypes.STRING,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'shows',
  timestamps: true,
  underscored: true
});

module.exports = Show;