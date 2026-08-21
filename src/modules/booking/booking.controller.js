const bookingService = require("./booking.service");

const createBooking = async (
  req,
  res,
  next
) => {
  try {
    const booking =
      await bookingService.createBooking(
        req.user.userId,
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerBookings = async (
  req,
  res,
  next
) => {
  try {
    const bookings =
      await bookingService.getCustomerBookings(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      data: {
        bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (
  req,
  res,
  next
) => {
  try {
    const booking =
      await bookingService.getBookingById(
        req.user.userId,
        req.params.id
      );

    res.status(200).json({
      success: true,
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (
  req,
  res,
  next
) => {
  try {
    const booking =
      await bookingService.cancelBooking(
        req.user.userId,
        req.params.id,
        req.body.reason
      );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getCustomerBookings,
  getBookingById,
  cancelBooking,
};