const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  role: { 
    type: DataTypes.ENUM('admin', 'resident'),
    defaultValue: 'resident',
    allowNull: false,
  },
  usageLimit: { 
    type: DataTypes.FLOAT, 
    defaultValue: 500,
    validate: {
      min: 0
    }
  }
});

module.exports = User;