const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {

    name: {
      type: String,
      unique: true,
      trim: true,
    },
    desc:{
      type:String,
      required:true
    },
    imageLink:{
        type:String,
    },
    isActive:{
        type:Boolean
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category",categorySchema);