const express = require('express');
const { User, WaterUsage } = require('../models');
const { Op } = require('sequelize');
const sendAlertEmail = require('../utils/sendMail');

const router = express.Router();

// Log water usage
router.post('/', async (req, res) => {
  try {
    const { UserId, usage, timestamp } = req.body;

    // Validation
    if (!UserId || !usage) {
      return res.status(400).json({ error: 'UserId and usage are required' });
    }

    const usageTimestamp = timestamp ? new Date(timestamp) : new Date();

    const newUsage = await WaterUsage.create({
      UserId,
      usage,
      timestamp: usageTimestamp
    });

    // Check if user exceeded their limit this month
    const startOfMonth = new Date(usageTimestamp.getFullYear(), usageTimestamp.getMonth(), 1);

    const usageThisMonth = await WaterUsage.sum('usage', {
      where: {
        UserId: UserId,
        timestamp: { [Op.gte]: startOfMonth }
      }
    });

    const user = await User.findByPk(UserId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (usageThisMonth > user.usageLimit) {
      await sendAlertEmail(user.email, user.name, usageThisMonth, user.usageLimit);
      console.log(`ALERT: User ${user.name} exceeded water usage limit.`);
    }

    res.status(201).json(newUsage);
  } catch (error) {
    console.error('Error logging usage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;