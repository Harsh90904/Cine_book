module.exports = (sequelize, DataTypes) => {
  const Seat = sequelize.define('Seat', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    seat_number: { type: DataTypes.STRING, allowNull: false },
    row: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Regular' }
  });

  Seat.associate = models => {
    Seat.belongsTo(models.Screen, { foreignKey: 'screen_id', onDelete: 'CASCADE' });
    Seat.hasMany(models.ShowSeat, { foreignKey: 'seat_id' });
  };

  return Seat;
};
