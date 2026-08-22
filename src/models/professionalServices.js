const mongoose = require("mongoose");

const professionalServiceSchema =
  new mongoose.Schema(
    {
      professional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professional",
        required: true,
        index: true,
      },

      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
        index: true,
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

professionalServiceSchema.index(
  {
    professional: 1,
    service: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "ProfessionalService",
  professionalServiceSchema
);