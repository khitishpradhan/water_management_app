const express = require('express');
const { User, WaterUsage } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ error: error.errors.map(e => e.message) });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get all usage for a specific user
router.get('/:id/usage', async (req, res) => {
  try {
    const usage = await WaterUsage.findAll({
      where: { UserId: req.params.id },
      order: [['timestamp', 'DESC']]
    });
    res.json(usage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching usage' });
  }
});

// Get filtered usage for a user by time period
router.get('/:id/usage/filter', async (req, res) => {
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
      return res.status(400).json({ error: 'Invalid period. Use hour, day, month, or year.' });
  }

  try {
    const usage = await WaterUsage.findAll({
      where: {
        UserId: id,
        timestamp: { [Op.gte]: start }
      },
      order: [['timestamp', 'DESC']]
    });
    res.json(usage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while filtering usage' });
  }
});

module.exports = router;