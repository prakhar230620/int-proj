"use client"

import { createContext, useReducer } from "react"
import axios from "axios"

export const NoteContext = createContext()

const initialState = {
  notes: [],
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

  // Get Notes
  const getNotes = async () => {
    try {
      const res = await axios.get("/api/notes")
      dispatch({ type: "GET_NOTES", payload: res.data })
    } catch (err) {
      dispatch({ type: "NOTE_ERROR", payload: err.response.msg })
    }
  }

  // Add Note
  const addNote = async (note) => {
    try {
      const res = await axios.post("/api/notes", note)
      dispatch({ type: "ADD_NOTE", payload: res.data })
    } catch (err) {
      dispatch({ type: "NOTE_ERROR", payload: err.response.msg })
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
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        loading: state.loading,
        getNotes,
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
