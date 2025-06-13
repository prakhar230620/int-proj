"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { NoteContext } from "../../context/NoteContext"
import "./Notes.css"

const NoteItem = ({ note }) => {
  const noteContext = useContext(NoteContext)
  const { deleteNote, clearCurrent } = noteContext
  const { _id, title, description, color } = note
  const navigate = useNavigate()

  const onDelete = (e) => {
    e.stopPropagation() // Prevent navigating when deleting
    deleteNote(_id)
    clearCurrent()
  }

  const viewNoteDetail = () => {
    navigate(`/note/${_id}`)
  }

  // Truncate description if it's too long
  const truncateText = (text, maxLength) => {
    if (!text) return ""; // Return empty string if text is undefined or null
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <div 
      className="note-card" 
      style={{ borderTop: `5px solid ${color}`, cursor: "pointer" }} 
      onClick={viewNoteDetail}
    >
      <h3>{title}</h3>
      <p className="note-description">{truncateText(description, 100)}</p>
      <div className="note-actions" onClick={(e) => e.stopPropagation()}>
        <button 
          className="btn btn-sm btn-danger" 
          onClick={onDelete}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  )
}

export default NoteItem
