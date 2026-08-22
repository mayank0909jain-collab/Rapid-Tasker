const express = require("express");

const kycController =
  require("./kyc.controller");

const authMiddleware =
  require("../../middleware/auth.middleware");

const roleMiddleware =
  require("../../middleware/role.middleware");

const router = express.Router();

router.use(
  authMiddleware,
  roleMiddleware("PROFESSIONAL")
);

router.post(
  "/",
  kycController.uploadDocument
);

router.get(
  "/",
  kycController.getDocuments
);

module.exports = router;