const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
    },
    address:{
      type:[String],
      default:[],
    },
    role: {
      type: String,
      enum: ["CUSTOMER", "PROFESSIONAL", "ADMIN"],
      default: "CUSTOMER",
    },

    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
      lowercase: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);