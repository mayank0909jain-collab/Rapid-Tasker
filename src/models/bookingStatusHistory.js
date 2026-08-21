const mongoose = require("mongoose");

const bookingStatusHistorySchema =
  new mongoose.Schema(
    {
      booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
        index: true,
      },

      status: {
        type: String,
        required: true,
      },

      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      note: {
        type: String,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "BookingStatusHistory",
  bookingStatusHistorySchema
);