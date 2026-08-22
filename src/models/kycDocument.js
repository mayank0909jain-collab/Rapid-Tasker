const mongoose = require("mongoose");

const kycDocumentSchema = new mongoose.Schema(
  {
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
      required: true,
      index: true,
    },

    documentType: {
      type: String,
      enum: [
        "AADHAAR",
        "PAN",
        "DRIVING_LICENSE",
        "OTHER",
      ],
      required: true,
    },

    documentUrl: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
      ],
      default: "PENDING",
    },

    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "KycDocument",
  kycDocumentSchema
);