const express = require("express");

const authMiddleware =
  require("../../middlewares/auth.middleware");

const roleMiddleware =
  require("../../middlewares/role.middleware");

const adminController =
  require("./admin.controller");

const customerController =
  require("./customer.controller");

const professionalController =
  require("./professional.controller");

const serviceController =
  require("./service.controller");

const bookingController =
  require("./booking.controller");

const complaintController =
  require("./complaint.controller");

const reportController =
  require("./report.controller");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Admin Authentication & Authorization
|--------------------------------------------------------------------------
*/

router.use(
  authMiddleware,
  roleMiddleware("ADMIN")
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  adminController.getDashboard
);

/*
|--------------------------------------------------------------------------
| Customers
|--------------------------------------------------------------------------
*/

router.get(
  "/customers",
  customerController.getCustomers
);

router.get(
  "/customers/:id",
  customerController.getCustomerById
);

router.patch(
  "/customers/:id/status",
  customerController.updateCustomerStatus
);

/*
|--------------------------------------------------------------------------
| Professionals
|--------------------------------------------------------------------------
*/

router.get(
  "/professionals",
  professionalController.getProfessionals
);

router.get(
  "/professionals/:id",
  professionalController.getProfessionalById
);

router.patch(
  "/professionals/:id/status",
  professionalController.updateProfessionalStatus
);

router.patch(
  "/professionals/kyc/:id",
  professionalController.updateKycStatus
);

/*
|--------------------------------------------------------------------------
| Services
|--------------------------------------------------------------------------
*/

router.post(
  "/services",
  serviceController.createService
);

router.get(
  "/services",
  serviceController.getServices
);

router.get(
  "/services/:id",
  serviceController.getServiceById
);

router.patch(
  "/services/:id",
  serviceController.updateService
);

router.patch(
  "/services/:id/status",
  serviceController.updateServiceStatus
);

/*
|--------------------------------------------------------------------------
| Bookings
|--------------------------------------------------------------------------
*/

router.get(
  "/bookings",
  bookingController.getBookings
);

router.get(
  "/bookings/:id",
  bookingController.getBookingById
);

router.patch(
  "/bookings/:id/assign",
  bookingController.assignBooking
);

router.patch(
  "/bookings/:id/cancel",
  bookingController.cancelBooking
);

/*
|--------------------------------------------------------------------------
| Complaints
|--------------------------------------------------------------------------
*/

router.get(
  "/complaints",
  complaintController.getComplaints
);

router.get(
  "/complaints/:id",
  complaintController.getComplaintById
);

router.patch(
  "/complaints/:id",
  complaintController.updateComplaint
);

/*
|--------------------------------------------------------------------------
| Reports
|--------------------------------------------------------------------------
*/

router.get(
  "/reports/overview",
  reportController.getOverviewReport
);

router.get(
  "/reports/revenue",
  reportController.getRevenueReport
);

router.get(
  "/reports/top-services",
  reportController.getTopServicesReport
);

module.exports = router;