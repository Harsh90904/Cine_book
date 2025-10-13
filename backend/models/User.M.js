const Datatypes = require('sequelize');
const sequelize = require('../config/DB');

const User = sequelize.define('User', {
    id:{
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Datatypes.STRING,
        allowNull: false
    },
    email:{
        type: Datatypes.STRING,
        unique: true,
        allowNull: false,
        validate: {isEmail: true}
    },
    passw:{
        type: Datatypes.STRING,
        allowNull: false
    },
    moblie_number:{
        type: Datatypes.NUMBER,
        allowNull: true
    },
    age:{
        type: Datatypes.INTEGER,
        allowNull: true
    },
    role:{
        type: Datatypes.ENUM('SUPERADMIN', 'ADMIN', 'USER'),
        defaultValue: 'USER'
    }
},{
    tableName: 'users',
    timestamps: true
});
module.exports = User;