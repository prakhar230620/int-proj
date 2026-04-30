"use client"

import { useContext, useState, useEffect } from "react"
import { NoteContext } from "../../context/NoteContext"
import NoteItem from "./NoteItem"
import "./Notes.css"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable'

const Notes = () => {
  const noteContext = useContext(NoteContext)
  const { notes, filtered, loading, getNotes, getFolders } = noteContext
  const [activeTab, setActiveTab] = useState("active") // "active", "archived", "trashed"
  const [localNotes, setLocalNotes] = useState([])

  useEffect(() => {
    getNotes()
    getFolders()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setLocalNotes(notes)
  }, [notes])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  if (loading) {
    return <h3>Loading notes...</h3>
  }

  if (notes.length === 0) {
    return <h3>Please add a note</h3>
  }

  // Filter based on tab
  let currentNotes = localNotes;
  if (activeTab === "active") {
    currentNotes = localNotes.filter(n => !n.isArchived && !n.isTrashed);
  } else if (activeTab === "archived") {
    currentNotes = localNotes.filter(n => n.isArchived && !n.isTrashed);
  } else if (activeTab === "trashed") {
    currentNotes = localNotes.filter(n => n.isTrashed);
  }

  let finalNotes = currentNotes;
  if (filtered !== null) {
    finalNotes = currentNotes.filter(n => 
      (n.title && n.title.toLowerCase().includes(filtered.toLowerCase())) ||
      (n.description && n.description.toLowerCase().includes(filtered.toLowerCase()))
    );
  }

  const sortedNotes = [...finalNotes].sort((a, b) => b.isPinned - a.isPinned);

  const handleDragEnd = (event) => {
    const {active, over} = event;
    if (active.id !== over.id) {
      setLocalNotes((items) => {
        const oldIndex = items.findIndex(i => i._id === active.id);
        const newIndex = items.findIndex(i => i._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <>
      <div className="notes-tabs">
        <button className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>Active</button>
        <button className={`tab-btn ${activeTab === 'archived' ? 'active' : ''}`} onClick={() => setActiveTab('archived')}>Archive</button>
        <button className={`tab-btn ${activeTab === 'trashed' ? 'active' : ''}`} onClick={() => setActiveTab('trashed')}>Trash</button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedNotes.map(n => n._id)} strategy={rectSortingStrategy}>
          <div className="notes-grid">
            {sortedNotes.length > 0 ? (
              sortedNotes.map((note) => <NoteItem key={note._id} note={note} />)
            ) : (
              <h4>No notes found in this category.</h4>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </>
  )
}

export default Notes
