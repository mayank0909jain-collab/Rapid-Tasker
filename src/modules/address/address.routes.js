const express = require("express");

const addressController = require("./address.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

const router = express.Router();

router.use(
  authMiddleware,
  roleMiddleware("CUSTOMER")
);

router.post(
  "/",
  addressController.createAddress
);

router.get(
  "/",
  addressController.getAddresses
);

router.get(
  "/:id",
  addressController.getAddressById
);

router.patch(
  "/:id",
  addressController.updateAddress
);

router.delete(
  "/:id",
  addressController.deleteAddress
);

module.exports = router;