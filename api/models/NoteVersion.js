const mongoose = require("mongoose");

const NoteVersionSchema = mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "note",
      required: true,
    },
    title: String,
    description: String,
    type: String,
    checklist: Array,
    tags: Array,
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("noteVersion", NoteVersionSchema);
