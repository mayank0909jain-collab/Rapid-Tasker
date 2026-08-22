const bookingService =
  require("./booking.service");

const getBookings = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await bookingService.getBookings({
        page: req.query.page,
        limit: req.query.limit,
        status: req.query.status,
        professional:
          req.query.professional,
        customer:
          req.query.customer,
        date: req.query.date,
      });

    return res.status(200).json({
      success: true,
      data: result,
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
    const result =
      await bookingService.getBookingById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const assignBooking = async (
  req,
  res,
  next
) => {
  try {
    const booking =
      await bookingService.assignBooking(
        req.params.id,
        req.body.professionalId,
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      message:
        "Professional assigned successfully",
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
        req.params.id,
        req.user.userId,
        req.body.reason
      );

    return res.status(200).json({
      success: true,
      message:
        "Booking cancelled successfully",
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookings,
  getBookingById,
  assignBooking,
  cancelBooking,
};