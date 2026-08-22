const express = require("express");

const professionalController =
  require("./professional.controller");

const authMiddleware =
  require("../../middlewares/auth.middleware");

const roleMiddleware =
  require("../../middlewares/role.middleware");

const router = express.Router();

router.use(
  authMiddleware,
  roleMiddleware("PROFESSIONAL")
);

router.get(
  "/profile",
  professionalController.getProfile
);

router.post(
  "/profile",
  professionalController.createProfile
);

router.patch(
  "/profile",
  professionalController.updateProfile
);

module.exports = router;