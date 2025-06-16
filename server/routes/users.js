const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const auth = require("../middleware/auth")
const { check, validationResult } = require("express-validator")

const User = require("../models/User")

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  "/",
  [
    check("name", "Please add name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (user) {
        return res.status(400).json({ msg: "User already exists" })
      }

      user = new User({
        name,
        email,
        password,
      })

      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      await user.save()

      const payload = {
        user: {
          id: user.id,
          isAdmin: user.isAdmin
        },
      }

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        },
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  },
)

// @route   GET api/users
// @desc    Get all users (admin only)
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.id).select("-password")
    if (!adminUser.isAdmin) {
      return res.status(403).json({ msg: "Not authorized as admin" })
    }
    
    const users = await User.find().select("-password").sort({ date: -1 })
    res.json(users)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   GET api/users/:id
// @desc    Get user by ID (admin only)
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.id).select("-password")
    if (!adminUser.isAdmin) {
      return res.status(403).json({ msg: "Not authorized as admin" })
    }
    
    const user = await User.findById(req.params.id).select("-password")
    
    if (!user) return res.status(404).json({ msg: "User not found" })

    res.json(user)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" })
    }
    res.status(500).send("Server Error")
  }
})

// @route   PUT api/users/:id
// @desc    Update user (admin only)
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.id).select("-password")
    if (!adminUser.isAdmin) {
      return res.status(403).json({ msg: "Not authorized as admin" })
    }
    
    const { name, email, bio, profilePicture, isAdmin } = req.body

    // Build user object
    const userFields = {}
    if (name) userFields.name = name
    if (email) userFields.email = email
    if (bio !== undefined) userFields.bio = bio
    if (profilePicture !== undefined) userFields.profilePicture = profilePicture
    if (isAdmin !== undefined) userFields.isAdmin = isAdmin

    let user = await User.findById(req.params.id)

    if (!user) return res.status(404).json({ msg: "User not found" })

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    ).select("-password")

    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   DELETE api/users/:id
// @desc    Delete user (admin only)
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.id).select("-password")
    if (!adminUser.isAdmin) {
      return res.status(403).json({ msg: "Not authorized as admin" })
    }
    
    const user = await User.findById(req.params.id)

    if (!user) return res.status(404).json({ msg: "User not found" })

    // Don't allow admin to delete themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({ msg: "Admin cannot delete their own account" })
    }

    await User.findByIdAndRemove(req.params.id)

    res.json({ msg: "User removed" })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" })
    }
    res.status(500).send("Server Error")
  }
})

module.exports = router
