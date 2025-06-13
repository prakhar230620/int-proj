"use client"

import { useState, useContext, useEffect, useRef } from "react"
import { NoteContext } from "../../context/NoteContext"
import "./Notes.css"

const NoteForm = () => {
  const noteContext = useContext(NoteContext)
  const { addNote, current, clearCurrent, updateNote } = noteContext
  const textareaRef = useRef(null)

  const [note, setNote] = useState({
    title: "",
    description: "",
    color: "#ffffff",
  })

  useEffect(() => {
    if (current !== null) {
      setNote(current)
    } else {
      setNote({
        title: "",
        description: "",
        color: "#ffffff",
      })
    }
  }, [current])

  useEffect(() => {
    // Auto-resize textarea based on content
    if (textareaRef.current) {
      adjustTextareaHeight()
    }
  }, [note.description])

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.max(80, textarea.scrollHeight)}px`
    }
  }

  const { title, description, color } = note

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (current === null) {
      addNote(note)
    } else {
      updateNote(note)
    }
    clearAll()
  }

  const clearAll = () => {
    clearCurrent()
  }

  return (
    <div className="note-form-container">
      <form onSubmit={onSubmit}>
        <h2>{current ? "Edit Note" : "Add Note"}</h2>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" value={title} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            name="description" 
            value={description} 
            onChange={onChange} 
            ref={textareaRef}
            className="auto-resize-textarea"
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="color">Color Tag</label>
          <input type="color" name="color" value={color} onChange={onChange} />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {current ? "Update Note" : "Add Note"}
          </button>
          {current && (
            <button type="button" className="btn btn-light" onClick={clearAll}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default NoteForm
