const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const auth = require("../middleware/auth")
const { check, validationResult } = require("express-validator")
const User = require("../models/User")

// @route   PUT api/profile
// @desc    Update current user's profile (name, email, bio, password)
// @access  Private
router.put(
  "/",
  auth,
  [
    check("name", "Name must not be empty").optional().not().isEmpty(),
    check("email", "Please include a valid email").optional().isEmail(),
    check("newPassword", "New password must be 6 or more characters")
      .optional()
      .isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, bio, currentPassword, newPassword } = req.body

    try {
      let user = await User.findById(req.user.id)
      if (!user) return res.status(404).json({ msg: "User not found" })

      // If updating email, make sure it's not taken by another user
      if (email && email !== user.email) {
        const existing = await User.findOne({ email })
        if (existing) {
          return res.status(400).json({ msg: "Email already in use" })
        }
      }

      // If changing password, verify current password first
      if (newPassword) {
        if (!currentPassword) {
          return res
            .status(400)
            .json({ msg: "Current password is required to set a new password" })
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
          return res.status(400).json({ msg: "Current password is incorrect" })
        }
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
      }

      if (name) user.name = name
      if (email) user.email = email
      if (bio !== undefined) user.bio = bio

      await user.save()

      const updatedUser = await User.findById(req.user.id).select("-password")
      res.json(updatedUser)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)

module.exports = router
