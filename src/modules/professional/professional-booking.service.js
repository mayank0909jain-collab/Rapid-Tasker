const Booking = require("../../models/booking");
const Professional = require("../../models/professional");
const BookingStatusHistory = require("../../models/bookingStatusHistory");
const ProfessionalService = require("../../models/professionalServices");

const getAvailableRequests = async (userId) => {
  const professional = await Professional.findOne({ user: userId });
  let matchedServiceIds = [];

  if (professional) {
    const profServices = await ProfessionalService.find({
      professional: professional._id,
      isActive: true,
    });
    matchedServiceIds = profServices.map((ps) => ps.service);
  }

  const query = {
    status: { $in: ["CONFIRMED", "PENDING"] },
    $or: [{ professional: null }, { professional: userId }],
  };

  if (matchedServiceIds.length > 0) {
    query.service = { $in: matchedServiceIds };
  }

  const bookings = await Booking.find(query)
    .populate("service", "name category price duration image")
    .populate("customer", "name phone email profileImage")
    .populate("address")
    .sort({ createdAt: -1 });

  return bookings;
};

const getMyBookings = async (userId, statusFilter) => {
  const query = { professional: userId };

  if (statusFilter === "upcoming") {
    query.status = "ACCEPTED";
  } else if (statusFilter === "active") {
    query.status = { $in: ["ON_THE_WAY", "STARTED"] };
  } else if (statusFilter === "completed") {
    query.status = "COMPLETED";
  } else if (statusFilter) {
    query.status = statusFilter.toUpperCase();
  }

  const bookings = await Booking.find(query)
    .populate("service", "name category price duration image")
    .populate("customer", "name phone email profileImage")
    .populate("address")
    .sort({ updatedAt: -1 });

  return bookings;
};

const getBookingDetails = async (userId, bookingId) => {
  const booking = await Booking.findById(bookingId)
    .populate("service", "name category price duration image description")
    .populate("customer", "name phone email profileImage")
    .populate("address");

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};

const acceptBooking = async (userId, bookingId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
    throw new Error(`Booking cannot be accepted from status: ${booking.status}`);
  }

  booking.status = "ACCEPTED";
  booking.professional = userId;
  await booking.save();

  await BookingStatusHistory.create({
    booking: booking._id,
    status: "ACCEPTED",
    changedBy: userId,
    note: "Booking accepted by professional",
  });

  return getBookingDetails(userId, bookingId);
};

const rejectBooking = async (userId, bookingId, reason) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  booking.status = "REJECTED";
  booking.cancellationReason = reason || "Rejected by professional";
  booking.cancelledBy = "PROFESSIONAL";
  await booking.save();

  await BookingStatusHistory.create({
    booking: booking._id,
    status: "REJECTED",
    changedBy: userId,
    note: reason || "Booking rejected by professional",
  });

  return booking;
};

const startService = async (userId, bookingId) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    professional: userId,
  });

  if (!booking) {
    throw new Error("Booking not found or not assigned to you");
  }

  if (!["ACCEPTED", "ON_THE_WAY"].includes(booking.status)) {
    throw new Error(`Cannot start service from status: ${booking.status}`);
  }

  booking.status = "STARTED";
  await booking.save();

  await BookingStatusHistory.create({
    booking: booking._id,
    status: "STARTED",
    changedBy: userId,
    note: "Service started by professional",
  });

  return getBookingDetails(userId, bookingId);
};

const completeService = async (userId, bookingId) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    professional: userId,
  });

  if (!booking) {
    throw new Error("Booking not found or not assigned to you");
  }

  if (booking.status !== "STARTED") {
    throw new Error(`Cannot complete service from status: ${booking.status}`);
  }

  booking.status = "COMPLETED";
  await booking.save();

  await BookingStatusHistory.create({
    booking: booking._id,
    status: "COMPLETED",
    changedBy: userId,
    note: "Service completed by professional",
  });

  // Credit earnings to professional profile
  const professional = await Professional.findOne({ user: userId });
  if (professional) {
    professional.totalEarnings = (professional.totalEarnings || 0) + (booking.price || 0);
    professional.completedJobsCount = (professional.completedJobsCount || 0) + 1;
    await professional.save();
  }

  return getBookingDetails(userId, bookingId);
};

const toggleOnlineStatus = async (userId, isOnline) => {
  const professional = await Professional.findOne({ user: userId });
  if (!professional) {
    throw new Error("Professional profile not found");
  }

  professional.isOnline = isOnline !== undefined ? isOnline : !professional.isOnline;
  await professional.save();

  return professional;
};

const getDashboardStats = async (userId) => {
  const professional = await Professional.findOne({ user: userId });

  // Today's earnings calculation
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const completedToday = await Booking.find({
    professional: userId,
    status: "COMPLETED",
    updatedAt: { $gte: startOfDay },
  });

  const todayEarnings = completedToday.reduce((sum, b) => sum + (b.price || 0), 0);

  // Active booking
  const activeBooking = await Booking.findOne({
    professional: userId,
    status: { $in: ["ACCEPTED", "ON_THE_WAY", "STARTED"] },
  })
    .populate("service", "name price category")
    .populate("customer", "name phone")
    .populate("address");

  const availableRequests = await getAvailableRequests(userId);

  return {
    todayEarnings,
    totalEarnings: professional ? professional.totalEarnings : 0,
    completedJobsCount: professional ? professional.completedJobsCount : 0,
    rating: professional ? professional.rating : 5.0,
    ratingsCount: professional ? (professional.ratingsCount || 0) : 0,
    isOnline: professional ? professional.isOnline : true,
    kycStatus: professional ? professional.kycStatus : "NOT_SUBMITTED",
    newRequestsCount: availableRequests.length,
    activeBooking,
  };
};

const getEarningsSummary = async (userId) => {
  const professional = await Professional.findOne({ user: userId });

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const completedBookings = await Booking.find({
    professional: userId,
    status: "COMPLETED",
  })
    .populate("service", "name")
    .populate("customer", "name")
    .sort({ updatedAt: -1 });

  let todayEarnings = 0;
  let weekEarnings = 0;
  let monthEarnings = 0;
  let totalEarnings = professional ? professional.totalEarnings : 0;

  const history = completedBookings.map((b) => {
    const amount = b.price || 0;
    const date = b.updatedAt;

    if (date >= startOfDay) todayEarnings += amount;
    if (date >= startOfWeek) weekEarnings += amount;
    if (date >= startOfMonth) monthEarnings += amount;

    return {
      id: b._id,
      bookingId: `BK-${b._id.toString().substring(18).toUpperCase()}`,
      service: b.service ? b.service.name : "Service",
      customerName: b.customer ? b.customer.name : "Customer",
      date: date.toISOString(),
      amount,
    };
  });

  return {
    todayEarnings,
    weekEarnings,
    monthEarnings,
    totalEarnings,
    history,
  };
};

module.exports = {
  getAvailableRequests,
  getMyBookings,
  getBookingDetails,
  acceptBooking,
  rejectBooking,
  startService,
  completeService,
  toggleOnlineStatus,
  getDashboardStats,
  getEarningsSummary,
};
