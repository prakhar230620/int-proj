const express = require("express")
require("dotenv").config()
const connectDB = require("./config/db")
const cors = require("cors")

const app = express()

// Connect Database
connectDB()

// Init Middleware
app.use(express.json({ extended: false }))
app.use(cors())

// Define Routes
app.use("/api/users", require("./routes/users"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/notes", require("./routes/notes"))

const PORT = process.env.PORT || 50000

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

module.exports = app
