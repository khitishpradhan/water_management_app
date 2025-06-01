const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const WaterUsage = sequelize.define('WaterUsage', {
  usage: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  timestamp: { 
    type: DataTypes.DATE, 
    defaultValue: Sequelize.NOW 
  }
});

module.exports = WaterUsage;