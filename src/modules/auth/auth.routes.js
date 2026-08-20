const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");

const authController = require("./auth.controller");

const router = express.Router();

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.get(
  "/me",
  authMiddleware,
  authController.getCurrentUser
);
module.exports = router;