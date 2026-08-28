const service = require("./professional-booking.service");

const getAvailableRequests = async (req, res, next) => {
  try {
    const requests = await service.getAvailableRequests(req.user.userId);
    res.status(200).json({
      success: true,
      data: { requests },
    });
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const bookings = await service.getMyBookings(req.user.userId, status);
    res.status(200).json({
      success: true,
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
};

const getBookingDetails = async (req, res, next) => {
  try {
    const booking = await service.getBookingDetails(
      req.user.userId,
      req.params.id
    );
    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

const acceptBooking = async (req, res, next) => {
  try {
    const booking = await service.acceptBooking(
      req.user.userId,
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: "Booking accepted successfully",
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

const rejectBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await service.rejectBooking(
      req.user.userId,
      req.params.id,
      reason
    );
    res.status(200).json({
      success: true,
      message: "Booking rejected",
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

const startService = async (req, res, next) => {
  try {
    const booking = await service.startService(
      req.user.userId,
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: "Service started",
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

const completeService = async (req, res, next) => {
  try {
    const booking = await service.completeService(
      req.user.userId,
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: "Service marked as completed",
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

const toggleOnlineStatus = async (req, res, next) => {
  try {
    const { isOnline } = req.body;
    const professional = await service.toggleOnlineStatus(
      req.user.userId,
      isOnline
    );
    res.status(200).json({
      success: true,
      message: "Online status updated",
      data: { professional },
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await service.getDashboardStats(req.user.userId);
    res.status(200).json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};

const getEarningsSummary = async (req, res, next) => {
  try {
    const earnings = await service.getEarningsSummary(req.user.userId);
    res.status(200).json({
      success: true,
      data: { earnings },
    });
  } catch (error) {
    next(error);
  }
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
