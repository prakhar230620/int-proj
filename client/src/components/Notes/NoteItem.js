"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { NoteContext } from "../../context/NoteContext"
import "./Notes.css"

const NoteItem = ({ note }) => {
  const noteContext = useContext(NoteContext)
  const { deleteNote, clearCurrent, updateNote } = noteContext
  const { _id, title, description, color, isPinned } = note
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

  const onPin = (e) => {
    e.stopPropagation()
    updateNote({ ...note, isPinned: !isPinned })
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <div 
      className={`note-card ${isPinned ? "pinned" : ""}`}
      style={{ borderTop: `5px solid ${color}`, cursor: "pointer" }} 
      onClick={viewNoteDetail}
    >
      <div className="note-card-header">
        <h3>{title}</h3>
        <button className="pin-btn" onClick={onPin} title={isPinned ? "Unpin" : "Pin"}>
          {isPinned ? "★" : "☆"}
        </button>
      </div>
      <p className="note-description">{truncateText(description, 100)}</p>
      <div className="note-footer">
        <span className="note-date">{formatDate(note.date)}</span>
        <div className="note-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className="btn btn-sm btn-danger" 
            onClick={onDelete}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteItem
