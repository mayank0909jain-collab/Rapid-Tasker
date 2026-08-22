const User = require("../../models/User");
const Booking = require("../../models/booking");
const Service = require("../../models/Service");
const Professional =
  require("../../models/professional");

const getDashboardStats = async () => {
  const [
    totalCustomers,
    totalProfessionals,
    pendingProfessionals,
    totalServices,
    totalBookings,
    completedBookings,
    cancelledBookings,
  ] = await Promise.all([
    User.countDocuments({
      role: "CUSTOMER",
    }),

    User.countDocuments({
      role: "PROFESSIONAL",
    }),

    Professional.countDocuments({
      status: "PENDING",
    }),

    Service.countDocuments({
      isActive: true,
    }),

    Booking.countDocuments(),

    Booking.countDocuments({
      status: "COMPLETED",
    }),

    Booking.countDocuments({
      status: "CANCELLED",
    }),
  ]);

  return {
    customers: totalCustomers,
    professionals: totalProfessionals,
    pendingProfessionals,
    services: totalServices,
    bookings: totalBookings,
    completedBookings,
    cancelledBookings,
  };
};

module.exports = {
  getDashboardStats,
};