"use client"

import { useContext, useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { NoteContext } from "../../context/NoteContext"
import "./Notes.css"

const NoteDetail = () => {
  const noteContext = useContext(NoteContext)
  const { notes, updateNote, deleteNote, clearCurrent } = noteContext
  const navigate = useNavigate()
  const { id } = useParams()

  const [note, setNote] = useState({
    _id: "",
    title: "",
    description: "",
    color: "#ffffff",
    isPinned: false,
  })

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const foundNote = notes.find((note) => note._id === id)
    if (foundNote) {
      setNote(foundNote)
    } else {
      navigate("/")
    }
    // eslint-disable-next-line
  }, [id, notes])

  const { _id, title, description, color, isPinned } = note

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    updateNote(note)
    setIsEditing(false)
  }

  const onDelete = () => {
    deleteNote(_id)
    clearCurrent()
    navigate("/")
  }

  const goBack = () => {
    navigate("/")
  }

  const onPin = () => {
    const updatedNote = { ...note, isPinned: !isPinned }
    setNote(updatedNote)
    updateNote(updatedNote)
  }

  return (
    <div className="note-detail-container glass-panel">
      <button className="btn btn-light back-button" onClick={goBack}>
        ← Back to Home
      </button>

      {isEditing ? (
        <form onSubmit={onSubmit} className="note-edit-form glass-panel">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" name="title" value={title} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea name="description" value={description} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="color">Color Tag</label>
            <input type="color" name="color" value={color} onChange={onChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <button type="button" className="btn btn-light" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="note-detail glass-panel" style={{ borderTop: `5px solid ${color}` }}>
          <div className="note-detail-header">
            <h2>
              {title}
              <button className="pin-btn" style={{marginLeft: "1rem"}} onClick={onPin} title={isPinned ? "Unpin" : "Pin"}>
                {isPinned ? "★" : "☆"}
              </button>
            </h2>
            <div className="note-detail-actions">
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                ✏️ Edit
              </button>
              <button className="btn btn-danger" onClick={onDelete}>
                🗑️ Delete
              </button>
            </div>
          </div>
          <div className="note-detail-content">
            <p>{description}</p>
          </div>
          {note.date && (
            <div className="note-detail-footer">
              <small className="text-muted">
                Created: {new Date(note.date).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NoteDetail