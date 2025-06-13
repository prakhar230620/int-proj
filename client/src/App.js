import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import Home from "./components/Home/Home"
import Navbar from "./components/Layout/Navbar"
import NoteDetail from "./components/Notes/NoteDetail"
import { AuthProvider } from "./context/AuthContext"
import { NoteProvider } from "./context/NoteContext"
import { ThemeProvider } from "./context/ThemeContext"
import PrivateRoute from "./components/Auth/PrivateRoute"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NoteProvider>
            <div className="app">
              <Navbar />
              <div className="container">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Home />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/note/:id"
                    element={
                      <PrivateRoute>
                        <NoteDetail />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </div>
          </NoteProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
