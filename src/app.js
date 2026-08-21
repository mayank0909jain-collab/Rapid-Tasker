const express = require("express");
const cors = require("cors");
const auth = require('./modules/auth/auth.routes');
const categoryRoutes = require('./modules/category/category.routes');
const serviceRoutes = require('./modules/services/service.routes');
const bookingRoutes = require('./modules/booking/booking.routes');
const addressRoutes = require('./modules/address/address.routes');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth',auth);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/service',serviceRoutes);
app.use('/api/v1/booking',bookingRoutes);
app.use('/api/v1/address',addressRoutes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Home Services API is running",
  });
});

module.exports = app;