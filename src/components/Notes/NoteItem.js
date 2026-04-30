"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { NoteContext } from "../../context/NoteContext"
import "./Notes.css"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const NoteItem = ({ note }) => {
  const noteContext = useContext(NoteContext)
  const { deleteNote, clearCurrent, updateNote } = noteContext
  const { _id, title, description, color, isPinned, isArchived, isTrashed, type, checklist, folder, tags, updatedAt } = note
  const navigate = useNavigate()

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: _id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderTop: `5px solid ${color}`,
    cursor: "grab",
  }

  const onArchive = (e) => {
    e.stopPropagation()
    updateNote({ ...note, isArchived: !isArchived })
  }

  const onTrash = (e) => {
    e.stopPropagation()
    if (isTrashed) {
      deleteNote(_id)
    } else {
      updateNote({ ...note, isTrashed: true, isPinned: false })
    }
    clearCurrent()
  }

  const onRestore = (e) => {
    e.stopPropagation()
    updateNote({ ...note, isTrashed: false })
  }

  const viewNoteDetail = (e) => {
    // Only navigate if we're not dragging/clicking a button
    if (e.target.tagName !== 'BUTTON' && !e.target.closest('.note-actions') && !e.target.closest('.pin-btn')) {
      navigate(`/note/${_id}`)
    }
  }

  const truncateText = (text, maxLength) => {
    if (!text) return "";
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
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`note-card ${isPinned ? "pinned" : ""} ${isArchived ? "archived" : ""} ${isTrashed ? "trashed" : ""}`}
      onClick={viewNoteDetail}
    >
      <div className="note-card-header">
        <h3>{title}</h3>
        {!isTrashed && (
          <button className="pin-btn" onClick={onPin} title={isPinned ? "Unpin" : "Pin"} onPointerDown={(e) => e.stopPropagation()}>
            {isPinned ? "★" : "☆"}
          </button>
        )}
      </div>
      
      {/* Folder Badge */}
      {folder && <span className="folder-badge" style={{ backgroundColor: folder.color || '#ccc' }}>📁 {folder.name}</span>}

      {/* Content Rendering based on type */}
      {type === "checklist" ? (
        <div className="note-checklist-preview">
          {checklist && checklist.slice(0, 3).map((item, index) => (
             <div key={index} className="checklist-item-preview">
               <input type="checkbox" checked={item.isCompleted} readOnly />
               <span style={{ textDecoration: item.isCompleted ? 'line-through' : 'none' }}>{item.text}</span>
             </div>
          ))}
          {checklist && checklist.length > 3 && <p className="more-items">+{checklist.length - 3} more items</p>}
        </div>
      ) : (
        <p className="note-description">{truncateText(description, 100)}</p>
      )}

      {/* Tags Rendering */}
      {tags && tags.length > 0 && (
        <div className="note-tags">
          {tags.map((tag, idx) => (
            <span key={idx} className="note-tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="note-footer">
        <span className="note-date">{formatDate(updatedAt || note.date)}</span>
        <div className="note-actions" onPointerDown={(e) => e.stopPropagation()}>
          {!isTrashed && (
            <button className="btn btn-sm" onClick={onArchive}>
              {isArchived ? "Unarchive" : "📦 Archive"}
            </button>
          )}
          {isTrashed ? (
            <>
              <button className="btn btn-sm btn-success" onClick={onRestore}>♻️ Restore</button>
              <button className="btn btn-sm btn-danger" onClick={onTrash}>🗑️ Delete Forever</button>
            </>
          ) : (
            <button className="btn btn-sm btn-danger" onClick={onTrash}>🗑️ Trash</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NoteItem
