const express = require("express");

const customerController = require("./customer.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

const router = express.Router();

router.use(
  authMiddleware,
  roleMiddleware("CUSTOMER")
);

router.get(
  "/profile",
  customerController.getProfile
);

router.patch(
  "/profile",
  customerController.updateProfile
);

module.exports = router;