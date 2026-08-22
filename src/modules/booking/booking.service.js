const Booking = require("../../models/booking");
const Service = require("../../models/service");
const Address = require("../../models/address");
const BookingStatusHistory =
  require("../../models/bookingStatusHistory");

const createBooking = async (customerId, data) => {
  const {
    serviceId,
    addressId,
    bookingDate,
    notes,
  } = data;

  const service = await Service.findOne({
    _id: serviceId,
    isActive: true,
  });

  if (!service) {
    throw new Error("Service not found");
  }

  const address = await Address.findOne({
    _id: addressId,
    customer: customerId,
    isActive: true,
  });

  if (!address) {
    throw new Error(
      "Address not found or does not belong to you"
    );
  }

  const selectedDate = new Date(bookingDate);

  if (isNaN(selectedDate.getTime())) {
    throw new Error("Invalid booking date");
  }

  if (selectedDate <= new Date()) {
    throw new Error(
      "Booking date must be in the future"
    );
  }

  const booking = await Booking.create({
    customer: customerId,
    service: service._id,
    address: address._id,
    bookingDate: selectedDate,
    price: service.price,
    duration: service.duration,
    status: "CONFIRMED",
    notes,
  });

  await BookingStatusHistory.create({
    booking: booking._id,
    status: "CONFIRMED",
    changedBy: customerId,
    note: "Booking created by customer",
  });

  return booking;
};

const getCustomerBookings = async (customerId) => {
  return Booking.find({
    customer: customerId,
  })
    .populate("service", "name image")
    .populate(
      "professional",
      "name phone"
    )
    .populate(
      "address",
      "label fullAddress city state pincode"
    )
    .sort({
      createdAt: -1,
    });
};
const getBookingById = async (
  customerId,
  bookingId
) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    customer: customerId,
  })
    .populate(
      "service",
      "name description image price duration"
    )
    .populate(
      "professional",
      "name phone"
    )
    .populate("address");

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};

const cancelBooking = async (
  customerId,
  bookingId,
  reason
) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    customer: customerId,
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  const cancellableStatuses = [
    "PENDING",
    "CONFIRMED",
    "ASSIGNED",
    "ACCEPTED",
  ];

  if (!cancellableStatuses.includes(booking.status)) {
    throw new Error(
      "This booking cannot be cancelled"
    );
  }

  booking.status = "CANCELLED";
  booking.cancelledBy = "CUSTOMER";
  booking.cancellationReason = reason;

  await booking.save();

  await BookingStatusHistory.create({
    booking: booking._id,
    status: "CANCELLED",
    changedBy: customerId,
    note: reason || "Cancelled by customer",
  });

  return booking;
};

module.exports = {
  createBooking,
  getCustomerBookings,
  getBookingById,
  cancelBooking,
};