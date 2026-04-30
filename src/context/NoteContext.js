"use client"

import { createContext, useReducer, useEffect, useRef } from "react"
import axios from "axios"
import { io } from "socket.io-client"

export const NoteContext = createContext()

const initialState = {
  notes: [],
  folders: [],
  current: null,
  filtered: null,
  error: null,
  loading: true,
}

const noteReducer = (state, action) => {
  switch (action.type) {
    case "GET_NOTES":
      return {
        ...state,
        notes: action.payload,
        loading: false,
      }
    case "GET_FOLDERS":
      return {
        ...state,
        folders: action.payload,
      }
    case "ADD_FOLDER":
      return {
        ...state,
        folders: [action.payload, ...state.folders],
      }
    case "DELETE_FOLDER":
      return {
        ...state,
        folders: state.folders.filter((f) => f._id !== action.payload),
      }
    case "ADD_NOTE":
      return {
        ...state,
        notes: [action.payload, ...state.notes],
      }
    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((note) => note._id !== action.payload),
      }
    case "SET_CURRENT":
      return {
        ...state,
        current: action.payload,
      }
    case "CLEAR_CURRENT":
      return {
        ...state,
        current: null,
      }
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map((note) => (note._id === action.payload._id ? action.payload : note)),
      }
    case "SYNC_NOTE":
      // Same as UPDATE_NOTE but just conceptually used for remote syncs
      return {
        ...state,
        notes: state.notes.map((note) => (note._id === action.payload._id ? action.payload : note)),
      }
    case "FILTER_NOTES":
      return {
        ...state,
        filtered: state.notes.filter((note) => {
          const regex = new RegExp(`${action.payload}`, "gi")
          return (note.title && note.title.match(regex)) || (note.description && note.description.match(regex))
        }),
      }
    case "CLEAR_FILTER":
      return {
        ...state,
        filtered: null,
      }
    case "NOTE_ERROR":
      return {
        ...state,
        error: action.payload,
      }
    default:
      return state
  }
}

export const NoteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(noteReducer, initialState)
  const socketRef = useRef(null)

  useEffect(() => {
    // Connect to Socket.io server
    socketRef.current = io(window.location.origin)
    
    // Listen for incoming changes
    socketRef.current?.on("receive-changes", (updatedNote) => {
      dispatch({ type: "SYNC_NOTE", payload: updatedNote })
    })

    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])

  // Get Notes
  const getNotes = async () => {
    try {
      const res = await axios.get("/api/notes")
      dispatch({ type: "GET_NOTES", payload: res.data })
      
      // Join socket rooms for all notes to receive real-time updates
      if (socketRef.current && res.data) {
        res.data.forEach(note => {
          socketRef.current.emit("join-note", note._id);
        });
      }
    } catch (err) {
      dispatch({ type: "NOTE_ERROR", payload: err.response?.data?.msg || err.message })
    }
  }

  // Get Folders
  const getFolders = async () => {
    try {
      const res = await axios.get("/api/folders")
      dispatch({ type: "GET_FOLDERS", payload: res.data })
    } catch (err) {
      dispatch({ type: "NOTE_ERROR", payload: err.response?.data?.msg || err.message })
    }
  }

  // Add Folder
  const addFolder = async (folder) => {
    try {
      const res = await axios.post("/api/folders", folder)
      dispatch({ type: "ADD_FOLDER", payload: res.data })
    } catch (err) {
      dispatch({ type: "NOTE_ERROR", payload: err.response?.data?.msg || err.message })
    }
  }

  // Delete Folder
  const deleteFolder = async (id) => {
    try {
      await axios.delete(`/api/folders/${id}`)
      dispatch({ type: "DELETE_FOLDER", payload: id })
    } catch (err) {
      dispatch({ type: "NOTE_ERROR", payload: err.response?.data?.msg || err.message })
    }
  }

  // AI Summarize
  const summarizeNote = async (text) => {
    try {
      const res = await axios.post("/api/ai/summarize", { text })
      return res.data.summary;
    } catch (err) {
      dispatch({ type: "NOTE_ERROR", payload: err.response?.data?.msg || err.message })
      return null;
    }
  }

  // AI Tags
  const generateTags = async (text) => {
    try {
      const res = await axios.post("/api/ai/tags", { text })
      return res.data.tags;
    } catch (err) {
      dispatch({ type: "NOTE_ERROR", payload: err.response?.data?.msg || err.message })
      return [];
    }
  }

  // Add Note
  const addNote = async (note) => {
    try {
      const res = await axios.post("/api/notes", note)
      dispatch({ type: "ADD_NOTE", payload: res.data })
    } catch (err) {
      dispatch({ type: "NOTE_ERROR", payload: err.response?.data?.msg || err.message })
    }
  }

  // Delete Note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`)
      dispatch({ type: "DELETE_NOTE", payload: id })
    } catch (err) {
      dispatch({ type: "NOTE_ERROR", payload: err.response.msg })
    }
  }

  // Update Note
  const updateNote = async (note) => {
    try {
      const res = await axios.put(`/api/notes/${note._id}`, note)
      dispatch({ type: "UPDATE_NOTE", payload: res.data })
    } catch (err) {
      dispatch({ type: "NOTE_ERROR", payload: err.response.msg })
    }
  }

  // Set Current Note
  const setCurrent = (note) => {
    dispatch({ type: "SET_CURRENT", payload: note })
  }

  // Clear Current Note
  const clearCurrent = () => {
    dispatch({ type: "CLEAR_CURRENT" })
  }

  // Filter Notes
  const filterNotes = (text) => {
    dispatch({ type: "FILTER_NOTES", payload: text })
  }

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: "CLEAR_FILTER" })
  }

  return (
    <NoteContext.Provider
      value={{
        notes: state.notes,
        folders: state.folders,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        loading: state.loading,
        getNotes,
        getFolders,
        addFolder,
        deleteFolder,
        summarizeNote,
        generateTags,
        addNote,
        deleteNote,
        setCurrent,
        clearCurrent,
        updateNote,
        filterNotes,
        clearFilter,
      }}
    >
      {children}
    </NoteContext.Provider>
  )
}
