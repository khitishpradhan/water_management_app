const express = require('express');
const { User, WaterUsage, Invoice } = require('../models');
const { Op } = require('sequelize');
RATE_PER_LITER = 5

const router = express.Router();

// Generate an invoice for a user
router.post('/users/:id/invoice', async (req, res) => {
  const userId = req.params.id;
  const { month } = req.body; // "2025-05"

  try {
    // Validation
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'Invalid month format. Use YYYY-MM' });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if invoice already exists for this month
    const existingInvoice = await Invoice.findOne({
      where: { UserId: userId, month }
    });

    if (existingInvoice) {
      return res.status(409).json({ error: 'Invoice already exists for this month' });
    }

    const start = new Date(`${month}-01T00:00:00.000Z`);
    
    // Get the last day of the month
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);

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
    const amount = totalUsage * RATE_PER_LITER;
  
    const invoice = await Invoice.create({ 
      UserId: userId, 
      month, 
      totalUsage, 
      amount 
    });
  
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Invoice generation failed' });
  }
});

// Get all invoices for a user
router.get('/users/:id/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.findAll({ 
      where: { UserId: req.params.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Server error while fetching invoices' });
  }
});

module.exports = router;