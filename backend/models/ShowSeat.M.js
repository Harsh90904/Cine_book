module.exports = (sequelize, DataTypes) => {
  const ShowSeat = sequelize.define('ShowSeat', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { 
      type: DataTypes.ENUM('available', 'booked', 'blocked'),
      defaultValue: 'available'
    }
  });

  ShowSeat.associate = models => {
    ShowSeat.belongsTo(models.Show, { foreignKey: 'show_id', onDelete: 'CASCADE' });
    ShowSeat.belongsTo(models.Seat, { foreignKey: 'seat_id', onDelete: 'CASCADE' });
  };

  return ShowSeat;
};
