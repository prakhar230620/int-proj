const mongoose = require("mongoose")

const NoteSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#ffffff",
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("note", NoteSchema)
