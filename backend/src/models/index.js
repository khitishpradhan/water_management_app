const sequelize = require('../config/database');
const User = require('./User');
const WaterUsage = require('./WaterUsage');
const Invoice = require('./Invoice');

// Define associations
User.hasMany(WaterUsage);
WaterUsage.belongsTo(User);

User.hasMany(Invoice);
Invoice.belongsTo(User);

module.exports = {
  sequelize,
  User,
  WaterUsage,
  Invoice
};