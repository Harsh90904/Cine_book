module.exports = (sequelize, DataTypes) => {
  const BookingSeat = sequelize.define('BookingSeat', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  });

  BookingSeat.associate = (models) => {
    BookingSeat.belongsTo(models.Booking, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
    BookingSeat.belongsTo(models.ShowSeat, { foreignKey: 'show_seat_id', onDelete: 'CASCADE' });
  };

  return BookingSeat;
};
