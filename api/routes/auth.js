const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const User = require("../models/User")

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post(
  "/",
  [check("email", "Please include a valid email").isEmail(), check("password", "Password is required").exists()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" })
      }

      if (user.isTwoFactorEnabled) {
        // Return temporary token for 2FA validation
        const tempPayload = { userId: user.id };
        const tempToken = jwt.sign(tempPayload, process.env.jwtSecret, { expiresIn: '5m' });
        return res.json({ requiresTwoFactor: true, tempToken });
      }

      const payload = {
        user: {
          id: user.id,
          isAdmin: user.isAdmin
        },
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   POST api/auth/verify-2fa
// @desc    Verify 2FA token and login
// @access  Public
router.post("/verify-2fa", async (req, res) => {
  const { tempToken, token } = req.body;
  
  try {
    const decoded = jwt.verify(tempToken, process.env.jwtSecret);
    const user = await User.findById(decoded.userId);
    
    if (!user) return res.status(400).json({ msg: "Invalid user" });
    
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token
    });
    
    if (!verified) return res.status(400).json({ msg: "Invalid 2FA code" });
    
    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin
      },
    };

    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(400).json({ msg: "Invalid or expired session" });
  }
});

// @route   POST api/auth/setup-2fa
// @desc    Setup 2FA for logged in user
// @access  Private
router.post("/setup-2fa", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const secret = speakeasy.generateSecret({ name: "NotesKeeper" });
    
    user.twoFactorSecret = secret.base32;
    await user.save();
    
    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      res.json({ secret: secret.base32, qrCode: data_url });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth/enable-2fa
// @desc    Enable 2FA for logged in user
// @access  Private
router.post("/enable-2fa", auth, async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findById(req.user.id);
    
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token
    });
    
    if (!verified) return res.status(400).json({ msg: "Invalid code" });
    
    user.isTwoFactorEnabled = true;
    await user.save();
    res.json({ msg: "2FA Enabled successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router
