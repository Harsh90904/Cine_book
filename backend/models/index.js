const sequelize = require('../config/DB');
const Show = require('./Show.M');
const Screen = require('./Screen.M');
const Movie = require('./movie.M');
const ShowSeat = require('./ShowSeat.M');
const Theater = require('./Thater.M'); // <-- Missing import added

function assignAssociations() {
  if (!Show || !Show.hasMany) {
    throw new Error('Show is not initialized correctly');
  }
  // Show.hasMany(ShowSeat, {
  //   foreignKey: 'show_id'
  // });

  // ShowSeat.belongsTo(Show, {
  //   foreignKey: 'show_id'
  // });
  Theater.hasMany(Screen, { foreignKey: "theater_id" });
  Screen.belongsTo(Theater, { foreignKey: "theater_id" });

  Screen.hasMany(Show, { foreignKey: "screen_id" });
  Show.belongsTo(Screen, { foreignKey: "screen_id" });
  // Relations
  Show.belongsTo(Screen, { foreignKey: 'screen_id', as: 'screen' });
  Show.belongsTo(Movie, { foreignKey: 'movie_id', as: 'movie' });
  Show.belongsTo(Theater, { foreignKey: 'theater_id', as: 'theater' }); // <-- IMPORTANT

  Theater.hasMany(Show, { foreignKey: 'theater_id', as: 'shows' }); // <-- Recommended

  Show.hasMany(ShowSeat, { foreignKey: 'show_id', as: 'seats' });
  ShowSeat.belongsTo(Show, { foreignKey: 'show_id', as: 'show' });
}

module.exports = {
  sequelize,
  Show,
  Screen,
  Movie,
  Theater,
  ShowSeat,
  assignAssociations,
};
