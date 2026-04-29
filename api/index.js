require("dotenv").config()
const express = require("express")
const connectDB = require("./config/db")
const cors = require("cors")

const app = express()

// Connect Database
connectDB()

// Init Middleware
app.use(express.json({ extended: false }))

// CORS - allow requests from frontend
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? true  // allow same-origin on Vercel
    : ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}))

// Define Routes
// Note: routes are mounted at /users, /auth, /notes
// On Vercel: incoming path is /api/users → vercel strips nothing, Express receives /api/users
// So we mount with the full /api/ prefix to match
app.use("/api/users", require("./routes/users"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/notes", require("./routes/notes"))

const PORT = process.env.SERVER_PORT || 5000

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

module.exports = app
