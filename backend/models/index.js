// backend/models/index.js
const sequelize = require('../config/DB');
const Show = require('./Show.M');
const Screen = require('./Screen.M');
const Movie = require('./movie.M');
const ShowSeat = require('./ShowSeat.M');
// other models...

function assignAssociations() {
  // ensure models are real before using them
  if (!Show || !Show.hasMany) {
    throw new Error('Show is not initialized correctly');
  }

  Show.belongsTo(Screen, { foreignKey: 'screen_id', as: 'screen' });
  Show.belongsTo(Movie, { foreignKey: 'movie_id', as: 'movie' });

  Show.hasMany(ShowSeat, { foreignKey: 'show_id', as: 'seats' });
  ShowSeat.belongsTo(Show, { foreignKey: 'show_id', as: 'show' });

  // add other associations...
}

module.exports = {
  sequelize,
  Show,
  Screen,
  Movie,
  ShowSeat,
  assignAssociations,
};
