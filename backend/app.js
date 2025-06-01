const express = require('express');
const { sequelize } = require('./src/models');
const userRoutes = require('./src/routes/users');
const usageRoutes = require('./src/routes/usage');
const invoiceRoutes = require('./src/routes/invoices');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/usage', usageRoutes);
app.use('/', invoiceRoutes);

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync();
    console.log('Database synchronized.');
    
    app.listen(port, () => {
      console.log(`Water Management API running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();

module.exports = app;