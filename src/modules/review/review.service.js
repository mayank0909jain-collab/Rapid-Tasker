const Review = require("../../models/review");
const Booking = require("../../models/booking");
const Professional = require("../../models/professional");

const recalculateProfessionalRating = async (professionalUserId) => {
  const reviews = await Review.find({ professional: professionalUserId });
  const ratingsCount = reviews.length;

  let averageRating = 5.0;
  if (ratingsCount > 0) {
    const totalSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    averageRating = Math.round((totalSum / ratingsCount) * 10) / 10;
  }

  await Professional.findOneAndUpdate(
    { user: professionalUserId },
    { rating: averageRating, ratingsCount: ratingsCount }
  );

  return { averageRating, ratingsCount };
};

const submitReview = async (customerId, { bookingId, rating, comment, tags }) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customer.toString() !== customerId.toString()) {
    throw new Error("Unauthorized to review this booking");
  }

  if (!booking.professional) {
    throw new Error("No professional assigned to this booking yet");
  }

  let review = await Review.findOne({ booking: bookingId });
  if (review) {
    review.rating = rating;
    review.comment = comment || "";
    review.tags = tags || [];
    await review.save();
  } else {
    review = await Review.create({
      booking: bookingId,
      customer: customerId,
      professional: booking.professional,
      service: booking.service,
      rating,
      comment: comment || "",
      tags: tags || [],
    });
  }

  const { averageRating, ratingsCount } = await recalculateProfessionalRating(booking.professional);

  return {
    review,
    averageRating,
    ratingsCount,
  };
};

const getProfessionalReviews = async (professionalUserId) => {
  const reviews = await Review.find({ professional: professionalUserId })
    .populate("customer", "name profileImage email phone")
    .populate("service", "name category")
    .sort({ createdAt: -1 });

  const ratingsCount = reviews.length;
  let totalSum = 0;
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach((r) => {
    totalSum += r.rating;
    const roundedStar = Math.min(5, Math.max(1, Math.round(r.rating)));
    breakdown[roundedStar] = (breakdown[roundedStar] || 0) + 1;
  });

  const averageRating = ratingsCount > 0 ? Math.round((totalSum / ratingsCount) * 10) / 10 : 5.0;

  return {
    averageRating,
    ratingsCount,
    breakdown,
    reviews,
  };
};

module.exports = {
  submitReview,
  getProfessionalReviews,
  recalculateProfessionalRating,
};
