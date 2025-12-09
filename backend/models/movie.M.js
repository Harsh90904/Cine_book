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
  // show_id: { type: DataTypes.UUID, allowNull: false },
  genre: DataTypes.STRING,
  duration: DataTypes.INTEGER,
  language: DataTypes.STRING,
  release_date: DataTypes.DATE,
  poster_url: DataTypes.STRING,
  Director: DataTypes.STRING,
  Writer: DataTypes.STRING,
  Actors: DataTypes.STRING,
  Country: DataTypes.STRING,
  Awards: DataTypes.STRING,
  Plot: DataTypes.TEXT,
  imdbRating: DataTypes.FLOAT,
  imdbVotes: DataTypes.INTEGER,
  imdbID:DataTypes.STRING,
  Type: DataTypes.STRING,
  BoxOffice_caletion: DataTypes.INTEGER
}, {
  tableName: 'movies',
  timestamps: true,
  underscored: true
});

module.exports = Movie;
