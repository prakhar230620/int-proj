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

  const sortedFiltered = filtered !== null ? [...filtered].sort((a, b) => b.isPinned - a.isPinned) : null;
  const sortedNotes = [...notes].sort((a, b) => b.isPinned - a.isPinned);

  return (
    <div className="notes-grid">
      {sortedFiltered !== null
        ? sortedFiltered.map((note) => <NoteItem key={note._id} note={note} />)
        : sortedNotes.map((note) => <NoteItem key={note._id} note={note} />)}
    </div>
  )
}

export default Notes
