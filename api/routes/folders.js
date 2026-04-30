const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const Folder = require("../models/Folder");

// @route   GET api/folders
// @desc    Get all user's folders
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(folders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/folders
// @desc    Add new folder
// @access  Private
router.post(
  "/",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, color } = req.body;

    try {
      let existingFolder = await Folder.findOne({ user: req.user.id, name });

      if (existingFolder) {
        return res.status(400).json({ msg: "Folder with this name already exists" });
      }

      const newFolder = new Folder({
        name,
        color,
        user: req.user.id,
      });

      const folder = await newFolder.save();
      res.json(folder);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/folders/:id
// @desc    Update folder
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { name, color } = req.body;

  const folderFields = {};
  if (name) folderFields.name = name;
  if (color) folderFields.color = color;

  try {
    let folder = await Folder.findById(req.params.id);

    if (!folder) return res.status(404).json({ msg: "Folder not found" });

    // Make sure user owns folder
    if (folder.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    folder = await Folder.findByIdAndUpdate(
      req.params.id,
      { $set: folderFields },
      { new: true }
    );

    res.json(folder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/folders/:id
// @desc    Delete folder
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);

    if (!folder) return res.status(404).json({ msg: "Folder not found" });

    if (folder.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Folder.findByIdAndRemove(req.params.id);

    res.json({ msg: "Folder removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
