"use client"

import { useState, useContext, useEffect, useRef } from "react"
import { NoteContext } from "../../context/NoteContext"
import "./Notes.css"

const NoteForm = () => {
  const noteContext = useContext(NoteContext)
  const { addNote, current, clearCurrent, updateNote, folders, summarizeNote, generateTags } = noteContext
  const textareaRef = useRef(null)

  const [note, setNote] = useState({
    title: "",
    description: "",
    color: "#ffffff",
    type: "text",
    checklist: [],
    folder: "",
    tags: []
  })
  
  const [loadingAI, setLoadingAI] = useState(false)

  useEffect(() => {
    if (current !== null) {
      setNote({
        ...current,
        folder: current.folder?._id || current.folder || "",
        checklist: current.checklist || [],
        tags: current.tags || []
      })
    } else {
      setNote({
        title: "",
        description: "",
        color: "#ffffff",
        type: "text",
        checklist: [],
        folder: "",
        tags: []
      })
    }
  }, [current])

  useEffect(() => {
    if (textareaRef.current && note.type === "text") {
      adjustTextareaHeight()
    }
  }, [note.description, note.type])

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.max(80, textarea.scrollHeight)}px`
    }
  }

  const { title, description, color, type, checklist, folder, tags } = note

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }

  const handleChecklistAdd = () => {
    setNote({ ...note, checklist: [...checklist, { text: "", isCompleted: false }] })
  }

  const handleChecklistChange = (index, value) => {
    const newChecklist = [...checklist]
    newChecklist[index].text = value
    setNote({ ...note, checklist: newChecklist })
  }
  
  const handleChecklistToggle = (index) => {
    const newChecklist = [...checklist]
    newChecklist[index].isCompleted = !newChecklist[index].isCompleted
    setNote({ ...note, checklist: newChecklist })
  }

  const handleAI = async (action) => {
    if (!description) return;
    setLoadingAI(true);
    if (action === "summarize") {
      const summary = await summarizeNote(description);
      if (summary) setNote({ ...note, description: summary });
    } else if (action === "tags") {
      const newTags = await generateTags(description);
      if (newTags) setNote({ ...note, tags: [...new Set([...tags, ...newTags])] });
    }
    setLoadingAI(false);
  }

  const handleVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice-to-Text.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
      setLoadingAI(true); // Reusing this for UI indicator
    };

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      setNote(prev => ({ ...prev, description: prev.description ? prev.description + " " + transcript : transcript }));
    };

    recognition.onerror = function(event) {
      console.error("Speech recognition error", event.error);
      setLoadingAI(false);
    };

    recognition.onend = function() {
      setLoadingAI(false);
    };

    recognition.start();
  }

  const onSubmit = (e) => {
    e.preventDefault()
    
    // Ensure folder is either an ID or null
    const submitNote = { ...note, folder: folder || null }
    
    if (current === null) {
      addNote(submitNote)
    } else {
      updateNote(submitNote)
    }
    clearAll()
  }

  const clearAll = () => {
    clearCurrent()
  }

  return (
    <div className="note-form-container glass-panel">
      <form onSubmit={onSubmit}>
        <h2>{current ? "Edit Note" : "Add Note"}</h2>
        
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" value={title} onChange={onChange} required />
        </div>

        <div className="form-group row-group">
          <div>
            <label htmlFor="type">Note Type</label>
            <select id="type" name="type" value={type} onChange={onChange}>
              <option value="text">Standard Text</option>
              <option value="checklist">Checklist</option>
            </select>
          </div>
          <div>
            <label htmlFor="folder">Folder</label>
            <select id="folder" name="folder" value={folder} onChange={onChange}>
              <option value="">No Folder</option>
              {folders.map(f => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>

        {type === "text" ? (
          <div className="form-group">
            <label htmlFor="description">
              Description
              <div className="ai-actions">
                <button type="button" className="btn btn-sm" onClick={handleVoiceRecording} disabled={loadingAI}>🎤 {loadingAI ? "Recording..." : "Voice"}</button>
                <button type="button" className="btn btn-sm" onClick={() => handleAI('summarize')} disabled={loadingAI}>✨ Summarize</button>
                <button type="button" className="btn btn-sm" onClick={() => handleAI('tags')} disabled={loadingAI}>🏷️ Auto-Tag</button>
              </div>
            </label>
            <textarea 
              id="description"
              name="description" 
              value={description} 
              onChange={onChange} 
              ref={textareaRef}
              className="auto-resize-textarea"
              style={{ height: '80px' }}
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Checklist Items</label>
            {checklist.map((item, index) => (
              <div key={index} className="checklist-input-group">
                <input 
                  type="checkbox" 
                  checked={item.isCompleted} 
                  onChange={() => handleChecklistToggle(index)} 
                />
                <input 
                  type="text" 
                  value={item.text} 
                  onChange={(e) => handleChecklistChange(index, e.target.value)} 
                  placeholder="Task item..."
                />
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-light" onClick={handleChecklistAdd}>+ Add Item</button>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="color">Color Tag</label>
          <input type="color" name="color" value={color} onChange={onChange} />
        </div>
        
        {tags.length > 0 && (
          <div className="form-group tags-display">
            {tags.map((t, idx) => <span key={idx} className="note-tag">#{t}</span>)}
          </div>
        )}

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
