const express = require("express");
const controller = require("./professional-booking.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

const router = express.Router();

router.use(authMiddleware, roleMiddleware("PROFESSIONAL"));

router.get("/requests", controller.getAvailableRequests);
router.get("/my-bookings", controller.getMyBookings);
router.get("/dashboard/stats", controller.getDashboardStats);
router.get("/earnings", controller.getEarningsSummary);
router.patch("/status/toggle-online", controller.toggleOnlineStatus);

router.get("/:id", controller.getBookingDetails);
router.post("/:id/accept", controller.acceptBooking);
router.post("/:id/reject", controller.rejectBooking);
router.post("/:id/start", controller.startService);
router.post("/:id/complete", controller.completeService);

module.exports = router;
