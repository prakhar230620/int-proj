"use client"

import { useContext } from "react"
import { NoteContext } from "../../context/NoteContext"
import NoteItem from "./NoteItem"
import "./Notes.css"

const Notes = () => {
  const noteContext = useContext(NoteContext)
  const { notes, filtered, loading } = noteContext

  if (loading) {
    return <h3>Loading notes...</h3>
  }

  if (notes.length === 0) {
    return <h3>Please add a note</h3>
  }

  return (
    <div className="notes-grid">
      {filtered !== null
        ? filtered.map((note) => <NoteItem key={note._id} note={note} />)
        : notes.map((note) => <NoteItem key={note._id} note={note} />)}
    </div>
  )
}

export default Notes
