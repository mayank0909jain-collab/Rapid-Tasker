const mongoose = require("mongoose");

const complaintSchema =
  new mongoose.Schema(
    {
      booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
      },

      customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      professional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      subject: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
        trim: true,
      },

      status: {
        type: String,
        enum: [
          "OPEN",
          "IN_PROGRESS",
          "RESOLVED",
          "CLOSED",
        ],
        default: "OPEN",
      },

      resolution: {
        type: String,
        trim: true,
      },

      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Complaint",
  complaintSchema
);