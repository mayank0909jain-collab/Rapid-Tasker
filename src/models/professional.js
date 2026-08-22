const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    bio: {
      type: String,
      trim: true,
    },

    profileImage: {
      type: String,
      trim: true,
    },

    experienceYears: {
      type: Number,
      min: 0,
      default: 0,
    },

    phone: {
      type: String,
      trim: true,
    },

    serviceArea: {
      city: {
        type: String,
        trim: true,
      },

      state: {
        type: String,
        trim: true,
      },
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "ACTIVE",
        "SUSPENDED",
        "REJECTED",
      ],
      default: "PENDING",
      index: true,
    },

    kycStatus: {
      type: String,
      enum: [
        "NOT_SUBMITTED",
        "PENDING",
        "APPROVED",
        "REJECTED",
      ],
      default: "NOT_SUBMITTED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Professional",
  professionalSchema
);