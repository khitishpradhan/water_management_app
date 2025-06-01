const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  month: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^\d{4}-\d{2}$/ // Format: YYYY-MM
    }
  },
  totalUsage: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  createdAt: { 
    type: DataTypes.DATE, 
    defaultValue: Sequelize.NOW 
  }
});

module.exports = Invoice;