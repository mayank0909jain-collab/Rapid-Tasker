const express = require("express");
const reviewController = require("./review.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

// Public / general route for professional reviews by professional ID
router.get("/professional/:id", reviewController.getProfessionalReviewsById);

// Protected routes
router.use(authMiddleware);

// Submit or update a review
router.post("/", reviewController.submitReview);

// Get my reviews as professional
router.get("/my-reviews", reviewController.getMyReviews);

module.exports = router;
