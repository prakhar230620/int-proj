const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const Note = require("../models/Note");
const NoteVersion = require("../models/NoteVersion");
const { cacheNotes, clearCache } = require("../middleware/cache");

// @route   GET api/notes
// @desc    Get all user's notes
// @access  Private
router.get("/", [auth, cacheNotes], async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
      .populate("folder", "name color")
      .sort({ updatedAt: -1 });
      
    // Set to cache
    const { redisClient } = require("../middleware/cache");
    if (redisClient && redisClient.status === 'ready') {
      redisClient.setex(`notes:${req.user.id}`, 3600, JSON.stringify(notes));
    }
    
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/notes
// @desc    Add new note
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      color,
      isPinned,
      isArchived,
      isTrashed,
      type,
      checklist,
      folder,
      tags,
    } = req.body;

    try {
      const newNote = new Note({
        title,
        description,
        color,
        isPinned,
        isArchived,
        isTrashed,
        type,
        checklist,
        folder: folder || null,
        tags,
        user: req.user.id,
      });

      const note = await newNote.save();
      
      // Populate folder for immediate frontend use if folder exists
      if (note.folder) {
        await note.populate("folder", "name color");
      }
      
      // Clear Redis Cache
      clearCache(req.user.id);
      
      res.json(note);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/notes/:id
// @desc    Update note
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const {
    title,
    description,
    color,
    isPinned,
    isArchived,
    isTrashed,
    type,
    checklist,
    folder,
    tags,
  } = req.body;

  // Build note object
  const noteFields = {};
  if (title !== undefined) noteFields.title = title;
  if (description !== undefined) noteFields.description = description;
  if (color !== undefined) noteFields.color = color;
  if (isPinned !== undefined) noteFields.isPinned = isPinned;
  if (isArchived !== undefined) noteFields.isArchived = isArchived;
  if (isTrashed !== undefined) noteFields.isTrashed = isTrashed;
  if (type !== undefined) noteFields.type = type;
  if (checklist !== undefined) noteFields.checklist = checklist;
  if (folder !== undefined) noteFields.folder = folder;
  if (tags !== undefined) noteFields.tags = tags;

  try {
    let note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ msg: "Note not found" });

    // Make sure user owns note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Save current state to NoteVersion before updating
    const version = new NoteVersion({
      noteId: note._id,
      title: note.title,
      description: note.description,
      type: note.type,
      checklist: note.checklist,
      tags: note.tags,
      modifiedBy: req.user.id,
    });
    await version.save();

    // Update Note
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: noteFields },
      { new: true }
    ).populate("folder", "name color");

    // Clear Redis Cache
    clearCache(req.user.id);

    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/notes/:id
// @desc    Delete note permanently
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ msg: "Note not found" });

    // Make sure user owns note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Delete associated versions
    await NoteVersion.deleteMany({ noteId: req.params.id });
    
    // Using deleteOne since remove() is deprecated in newer Mongoose versions
    await Note.deleteOne({ _id: req.params.id });

    // Clear Redis Cache
    clearCache(req.user.id);

    res.json({ msg: "Note removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
