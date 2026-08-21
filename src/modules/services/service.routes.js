const express = require("express");

const serviceController = require("./service.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

const router = express.Router();

// Customer
router.get("/", serviceController.getServices);
router.get("/:id", serviceController.getServiceById);

// Admin
router.post(
  "/",
  // authMiddleware,
  // roleMiddleware("ADMIN"),
  serviceController.createService
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  serviceController.updateService
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  serviceController.deleteService
);

module.exports = router;