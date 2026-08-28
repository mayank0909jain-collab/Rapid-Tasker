const reviewService = require("./review.service");

const submitReview = async (req, res, next) => {
  try {
    const customerId = req.user._id;
    const { bookingId, rating, comment, tags } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({
        success: false,
        message: "bookingId and rating are required",
      });
    }

    const result = await reviewService.submitReview(customerId, {
      bookingId,
      rating: Number(rating),
      comment,
      tags,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyReviews = async (req, res, next) => {
  try {
    const professionalUserId = req.user._id;
    const result = await reviewService.getProfessionalReviews(professionalUserId);

    res.status(200).json({
      success: true,
      message: "Professional reviews fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProfessionalReviewsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await reviewService.getProfessionalReviews(id);

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitReview,
  getMyReviews,
  getProfessionalReviewsById,
};
