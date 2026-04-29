require("dotenv").config()
const mongoose = require("mongoose")
const dns = require("dns")

// Use Google's DNS servers — ISP/router DNS often blocks MongoDB SRV lookups
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"])

const connectDB = async () => {
  const db = process.env.mongoURI

  if (!db) {
    console.error("mongoURI environment variable is not set!")
    process.exit(1)
  }

  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("MongoDB Connected...")
  } catch (err) {
    console.error("MongoDB connection error:", err.message)
    process.exit(1)
  }
}

module.exports = connectDB
