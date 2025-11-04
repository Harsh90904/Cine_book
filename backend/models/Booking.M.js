module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    show_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('confirmed', 'pending', 'cancelled'),
      defaultValue: 'pending',
    },
    payment_method: {
      type: DataTypes.STRING,
      defaultValue: 'online',
    },
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    Booking.belongsTo(models.Show, { foreignKey: 'show_id', onDelete: 'CASCADE' });
    Booking.hasMany(models.BookingSeat, { foreignKey: 'booking_id' });
  };

  return Booking;
};
