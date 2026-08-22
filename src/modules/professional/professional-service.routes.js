const express = require("express");

const controller =
  require("./professional-service.controller");

const authMiddleware =
  require("../../middlewares/auth.middleware");

const roleMiddleware =
  require("../../middlewares/role.middleware");

const router = express.Router();

router.use(
  authMiddleware,
  roleMiddleware("PROFESSIONAL")
);

router.post(
  "/",
  controller.addService
);

router.get(
  "/",
  controller.getServices
);

router.delete(
  "/:serviceId",
  controller.removeService
);

module.exports = router;