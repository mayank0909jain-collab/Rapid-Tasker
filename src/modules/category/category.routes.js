const express = require("express");

const categoryController = require("./category.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");

const router = express.Router();

// Customer
router.get("/", categoryController.getCategories);

// Admin
router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("ADMIN"),
  categoryController.getAllCategories
);

router.post(
  "/",
  // authMiddleware,
  // roleMiddleware("ADMIN"),
  categoryController.createCategory
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  categoryController.deleteCategory
);

module.exports = router;