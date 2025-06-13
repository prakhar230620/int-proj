const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const { check, validationResult } = require("express-validator")

const User = require("../models/User")
const Note = require("../models/Note")

// @route   GET api/notes
// @desc    Get all user's notes
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ date: -1 })
    res.json(notes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   POST api/notes
// @desc    Add new note
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, description, color } = req.body

    try {
      // Check if a note with the same title already exists for the user
      let existingNote = await Note.findOne({ user: req.user.id, title });

      if (existingNote) {
        return res.status(400).json({ msg: 'Note with this title already exists' });
      }

      const newNote = new Note({
        title,
        description,
        color,
        user: req.user.id,
      })

      const note = await newNote.save()
      res.json(note)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  },
)

// @route   PUT api/notes/:id
// @desc    Update note
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { title, description, color } = req.body

  // Build note object
  const noteFields = {}
  if (title) noteFields.title = title
  if (description) noteFields.description = description
  if (color) noteFields.color = color

  try {
    let note = await Note.findById(req.params.id)

    if (!note) return res.status(404).json({ msg: "Note not found" })

    // Make sure user owns note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" })
    }

    note = await Note.findByIdAndUpdate(req.params.id, { $set: noteFields }, { new: true })

    res.json(note)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   DELETE api/notes/:id
// @desc    Delete note
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) return res.status(404).json({ msg: "Note not found" })

    // Make sure user owns note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" })
    }

    await Note.findByIdAndRemove(req.params.id)

    res.json({ msg: "Note removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router
