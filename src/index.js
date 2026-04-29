import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import axios from "axios"

// Set base URL for axios
// Empty string = relative URLs. In dev, CRA proxy (see package.json "proxy") forwards
// /api/* to Express on port 3001. In production, Vercel rewrites handle it.
axios.defaults.baseURL = ""


// Add token to headers if exists
const token = localStorage.getItem("token")
if (token) {
  axios.defaults.headers.common["x-auth-token"] = token
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
