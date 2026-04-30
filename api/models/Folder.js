const mongoose = require("mongoose");

const FolderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: "#ffffff",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("folder", FolderSchema);
