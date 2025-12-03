const Theater = require("../models/Thater.M");
const Screen = require("../models/Screen.M");
const Show = require("../models/Show.M");
const Movie = require("../models/movie.M");

// Associations
Theater.hasMany(Screen, { foreignKey: "theater_id" });
Screen.belongsTo(Theater, { foreignKey: "theater_id" });

Screen.hasMany(Show, { foreignKey: "screen_id" });
Show.belongsTo(Screen, { foreignKey: "screen_id" });

Movie.hasMany(Show, { foreignKey: "movie_id" });
Show.belongsTo(Movie, { foreignKey: "movie_id" });

module.exports = { Theater, Screen, Show, Movie };
