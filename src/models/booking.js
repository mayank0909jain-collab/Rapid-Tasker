const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "ASSIGNED",
        "ACCEPTED",
        "ON_THE_WAY",
        "STARTED",
        "COMPLETED",
        "REJECTED",
        "CANCELLED",
      ],
      default: "PENDING",
      index: true,
    },

    cancellationReason: {
      type: String,
      trim: true,
    },

    cancelledBy: {
      type: String,
      enum: [
        "CUSTOMER",
        "PROFESSIONAL",
        "ADMIN",
      ],
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Booking",
  bookingSchema
);