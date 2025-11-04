const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB');

const Theater = sequelize.define('Theater', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  pincode: DataTypes.STRING,
  contact_number: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true }
  },
  total_screens: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  images: DataTypes.ARRAY(DataTypes.STRING),
  total_seats: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  seat_layout: DataTypes.JSONB,
  amenities: DataTypes.JSONB,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'theaters',
  timestamps: true,
  underscored: true
});

module.exports = Theater;
