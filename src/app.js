const express = require("express");
const cors = require("cors");
const auth = require('./modules/auth/auth.routes');
const categoryRoutes = require('./modules/category/category.routes');
const serviceRoutes = require('./modules/services/service.routes');
const bookingRoutes = require('./modules/booking/booking.routes');
const addressRoutes = require('./modules/address/address.routes');
const professionalRoutes = require('./modules/professional/professional_routes');
const professionalServiceRoutes = require('./modules/professional/professional-service.routes');
const professionalBookingRoutes = require('./modules/professional/professional-booking.routes');
const kycRoutes = require('./modules/kyc/kyc.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const customerRoutes = require('./modules/customer/customer.routes');
const reviewRoutes = require('./modules/review/review.routes');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth',auth);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/service',serviceRoutes);
app.use('/api/v1/booking',bookingRoutes);
app.use('/api/v1/address',addressRoutes);
app.use('/api/v1/customer',customerRoutes);
app.use('/api/v1/professional',professionalRoutes);
app.use('/api/v1/professional-service',professionalServiceRoutes);
app.use('/api/v1/professional-booking',professionalBookingRoutes);
app.use('/api/v1/kyc',kycRoutes);
app.use('/api/v1/admin',adminRoutes);
app.use('/api/v1/review',reviewRoutes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Home Services API is running",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler caught an error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
});

module.exports = app;