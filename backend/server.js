// server.js
const express = require('express');
const { Sequelize, DataTypes, Op } = require('sequelize');
const app = express();
const port = 3000;

const sendAlertEmail = require('./sendMail');

const ratePerLiter = 5
// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

// Middleware
app.use(express.json());

// Connect to MySQL
const sequelize = new Sequelize('water_management', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

// Models
const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  role: { 
    type: DataTypes.ENUM('admin', 'resident'),
    defaultValue: 'resident',
    allowNull: false,
  },
  usageLimit: { type: DataTypes.FLOAT, defaultValue: 500 }
});

const WaterUsage = sequelize.define('WaterUsage', {
  usage: DataTypes.FLOAT,
  timestamp: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
});

const Invoice = sequelize.define('Invoice', {
  month: DataTypes.STRING,
  totalUsage: DataTypes.FLOAT,
  amount: DataTypes.FLOAT,
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
});

User.hasMany(WaterUsage);
WaterUsage.belongsTo(User);

User.hasMany(Invoice);
Invoice.belongsTo(User);

// Sync DB
sequelize.sync();

// Routes
app.get('/users', async (req, res) => {
    try {
      const users = await User.findAll(); // Fetch all users
      res.status(200).json(users);       // Send as JSON
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// User Routes
// Create a new user
app.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).send(user);
});

// Usage Routes
// Log water usage
app.post('/usage', async (req, res) => {
  const { UserId, usage, timestamp } = req.body;

  const usageTimestamp = timestamp ? new Date(timestamp) : new Date();

  const newUsage = await WaterUsage.create({
    UserId,
    usage,
    timestamp: usageTimestamp
  });

  const startOfMonth = new Date(usageTimestamp.getFullYear(), usageTimestamp.getMonth(), 1);

  const usageThisMonth = await WaterUsage.sum('usage', {
    where: {
      UserId: UserId,
      timestamp: { [Op.gte]: startOfMonth }
    }
  });

  const user = await User.findByPk(UserId);

  if (usageThisMonth > user.usageLimit) {
    await sendAlertEmail(user.email, user.name, usageThisMonth, user.usageLimit);
    console.log(`ALERT: User ${user.name} exceeded water usageLimit.`);
  }

  res.status(201).send(newUsage);
});

// View all usage for a user
app.get('/users/:id/usage', async (req, res) => {
  try {
    const usage = await WaterUsage.findAll({
      where: { UserId: req.params.id },
      order: [['timestamp', 'DESC']]
    });
    res.send(usage);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error while fetching usage' });
  }
});

// View usage for a user in a given time period
// GET /users/:id/usage/filter?period=hour|day|month|year
app.get('/users/:id/usage/filter', async (req, res) => {
  const { id } = req.params;
  const { period } = req.query;

  const now = new Date();
  let start;

  switch (period) {
    case 'hour':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0);
      break;
    case 'day':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      return res.status(400).send({ error: 'Invalid period. Use hour, day, month, or year.' });
  }

  try {
    const usage = await WaterUsage.findAll({
      where: {
        UserId: id,
        timestamp: { [Op.gte]: start }
      },
      order: [['timestamp', 'DESC']]
    });
    res.send(usage);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error while filtering usage' });
  }
});


// Invoice Routes
// Generate an invoice for a user
app.post('/users/:id/invoice', async (req, res) => {
    const userId = req.params.id;
    const { month } = req.body; // "2025-05"
  
    try {
      const start = new Date(`${month}-01T00:00:00.000Z`);
      
      // Get the last day of the month
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999); // End of last day of the month
  
      console.log('Start:', start.toISOString());
      console.log('End:', end.toISOString());
  
      const usageRecords = await WaterUsage.findAll({
        where: {
          UserId: userId,
          timestamp: {
            [Op.gte]: start,
            [Op.lte]: end
          }
        }
      });
  
      const totalUsage = usageRecords.reduce((acc, u) => acc + u.usage, 0);
      const amount = totalUsage * ratePerLiter;
    
      const invoice = await Invoice.create({ UserId: userId, month, totalUsage, amount });
    
      res.status(201).send(invoice);
    } catch (error) {
      console.error(error);
      res.status(500).send("Invoice generation failed");
    }
});
  


// Get all invoices for user
app.get('/users/:id/invoices', async (req, res) => {
  const invoices = await Invoice.findAll({ where: { UserId: req.params.id } });
  res.send(invoices);
});

// Start server
app.listen(port, () => {
  console.log(`Water Management API running on http://localhost:${port}`);
});

