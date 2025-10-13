const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB');

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  genre: DataTypes.STRING,
  duration: DataTypes.INTEGER,
  language: DataTypes.STRING,
  release_date: DataTypes.DATE,
  poster_url: DataTypes.STRING,
  description: DataTypes.TEXT,
  rating: DataTypes.FLOAT
}, {
  tableName: 'movies',
  timestamps: true,
  underscored: true
});

module.exports = Movie;
