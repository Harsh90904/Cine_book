const User = require("./User.M");

module.exports = (sequelize, DataTypes) => {
  const Seat = sequelize.define('Seat', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  screen_id: DataTypes.UUID,
  row: DataTypes.STRING,      
  number: DataTypes.INTEGER,  
  type: DataTypes.ENUM('GOLD', 'SILVER', 'PLATINUM'),  
  status: DataTypes.ENUM('AVAILABLE', 'BOOKED', 'HOLD'),  
  price: DataTypes.INTEGER
});

  Seat.associate = models => {
    Seat.belongsTo(models.Screen, { foreignKey: 'screen_id', onDelete: 'CASCADE' });
    Seat.hasMany(models.ShowSeat, { foreignKey: 'seat_id' });
  };

  return Seat;
};
async function generateSeats(screenId, rows=10, seatsPerRow=12) {
  const seats = [];
  for (let row=1; row<=rows; row++) {
    for (let num=1; num<=seatsPerRow; num++) {
      seats.push({
        screen_id: screenId,
        row: String.fromCharCode(64 + row),  // A, B, C...
        number: num,
        type: row <= 3 ? 'GOLD' : row <= 6 ? 'SILVER' : 'PLATINUM',
        status: 'AVAILABLE',
        price: row <= 3 ? 300 : row <= 6 ? 250 : 200
      });
    }
  }
  return await Seat.bulkCreate(seats);
}