const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    category:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    name: {
      type: String,
      unique: true,
      trim: true,
    },
    desc:{
      type:String,
      required:true
    },
    duration: {
      type: Number,
      default: 60,
    },
    imageLink:{
        type:String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service",serviceSchema);