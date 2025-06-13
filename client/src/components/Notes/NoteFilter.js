"use client"

import { useContext, useRef, useEffect } from "react"
import { NoteContext } from "../../context/NoteContext"
import "./Notes.css"

const NoteFilter = () => {
  const noteContext = useContext(NoteContext)
  const { filterNotes, clearFilter, filtered } = noteContext
  const text = useRef("")

  useEffect(() => {
    if (filtered === null) {
      text.current.value = ""
    }
  }, [filtered])

  const onChange = (e) => {
    if (text.current.value !== "") {
      filterNotes(e.target.value)
    } else {
      clearFilter()
    }
  }

  return (
    <div className="note-filter">
      <input ref={text} type="text" placeholder="Search notes..." onChange={onChange} />
    </div>
  )
}

export default NoteFilter
