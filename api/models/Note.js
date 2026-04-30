const mongoose = require("mongoose")

const NoteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // Optional for checklist notes
    },
    color: {
      type: String,
      default: "#ffffff",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isTrashed: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["text", "checklist"],
      default: "text",
    },
    checklist: [
      {
        text: String,
        isCompleted: { type: Boolean, default: false },
      },
    ],
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "folder",
      default: null,
    },
    tags: [
      {
        type: String,
      },
    ],
    collaborators: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        role: { type: String, enum: ["editor", "viewer"], default: "viewer" },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
)

module.exports = mongoose.model("note", NoteSchema)
