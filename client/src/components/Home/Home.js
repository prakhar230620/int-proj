"use client"

import { useContext, useEffect } from "react"
import NoteForm from "../Notes/NoteForm"
import Notes from "../Notes/Notes"
import NoteFilter from "../Notes/NoteFilter"
import { NoteContext } from "../../context/NoteContext"
import "./Home.css"

const Home = () => {
  const { getNotes } = useContext(NoteContext)

  useEffect(() => {
    getNotes()
    // eslint-disable-next-line
  }, [])

  return (
    <div className="home-container">
      <div className="home-left">
        <NoteForm />
      </div>
      <div className="home-right">
        <NoteFilter />
        <Notes />
      </div>
    </div>
  )
}

export default Home
