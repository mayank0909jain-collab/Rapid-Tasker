const express = require("express");

const bookingController =
  require("./booking.controller");

const authMiddleware =
  require("../../middleware/auth.middleware");

const roleMiddleware =
  require("../../middleware/role.middleware");

const router = express.Router();

router.use(
  authMiddleware,
  roleMiddleware("CUSTOMER")
);

router.post(
  "/",
  bookingController.createBooking
);

router.get(
  "/",
  bookingController.getCustomerBookings
);

router.get(
  "/:id",
  bookingController.getBookingById
);

router.post(
  "/:id/cancel",
  bookingController.cancelBooking
);

module.exports = router;