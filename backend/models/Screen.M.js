const { DataTypes } = require('sequelize');
const sequelize = require('../config/DB');

const Screen = sequelize.define('Screen', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  theater_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  seat_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  seat_map: DataTypes.STRING,
  type: {
    type: DataTypes.ENUM('2D','3D','IMAX','4DX','OTHER'),
    defaultValue: '2D'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'screens',
  timestamps: true,
  underscored: true
});

module.exports = Screen;
