# NotesKeeper - Advanced MERN Application

A production-grade, feature-rich Notes Application built with the MERN stack (MongoDB, Express, React, Node.js). 
This application has been significantly enhanced to provide premium productivity features, real-time collaboration, offline capability, AI assistance, and robust security.

## Features

### 🚀 Productivity
- **Advanced Notes Editor:** Supports rich text, colored labels, and tagging.
- **Checklists:** Toggle notes into dynamic checklists to track your tasks efficiently.
- **Folders System:** Group and categorize notes into customized workspaces.
- **Lifecycle Management:** Complete state management for notes with `Pinned`, `Archived`, and `Trashed` statuses.
- **Drag-and-Drop (DnD):** Intuitive drag-and-drop reordering of notes powered by `@dnd-kit`.

### 🤖 AI Assistance
- **Voice-to-Text:** Built-in Web Speech API integration to dictate notes hands-free.
- **Auto-Summarization:** Use AI to automatically summarize lengthy notes.
- **Auto-Tagging:** Automatically generate relevant tags based on the note's content.

### 🔄 Real-time Collaboration
- **WebSocket Integration:** Powered by `Socket.io` to ensure seamless real-time syncing of notes across multiple sessions and devices without needing manual refreshes.

### 🔒 Security & Performance
- **Two-Factor Authentication (2FA):** Optional TOTP-based 2FA powered by `speakeasy` and `qrcode` for an extra layer of account security.
- **Rate Limiting:** Protects all API endpoints against brute force and DDoS attacks.
- **Redis Caching:** Accelerates read operations by heavily caching API responses, intelligently invalidated upon data mutation.

### 📱 Progressive Web App (PWA)
- **Offline Support:** Implements Service Workers and manifest configurations to deliver an app-like, installable experience that works offline.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas (or local instance)
- Redis Server (local or cloud)

### Environment Variables
Create a `.env` file in the root directory:

```env
# Server
SERVER_PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Security
JWT_SECRET=your_super_secret_jwt_key

# Redis Cache
REDIS_URL=redis://localhost:6379

# AI
GEMINI_API_KEY=your_gemini_or_openai_key
```

### Installation

```bash
# Install dependencies
npm install

# Start Development Server (Frontend + Backend concurrently)
npm run dev
```

---

## 🧪 Testing

The project uses `jest` and `supertest` for comprehensive backend testing, using an in-memory MongoDB server to isolate tests.

```bash
# Run backend API tests
npm run test:api

# Run frontend tests
npm run test
```

---

## 📡 API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /` - Login user (Returns `tempToken` if 2FA is enabled)
- `POST /verify-2fa` - Verify 2FA code and get persistent JWT
- `POST /setup-2fa` - Generate 2FA QR code and secret
- `POST /enable-2fa` - Validate and finalize 2FA setup

### Notes (`/api/notes`)
- `GET /` - Fetch all notes (Cached via Redis)
- `POST /` - Create a new note (Invalidates cache)
- `PUT /:id` - Update a note (Invalidates cache)
- `DELETE /:id` - Move to trash / Delete permanently

### Folders (`/api/folders`)
- `GET /` - Fetch all user folders
- `POST /` - Create a new folder
- `DELETE /:id` - Delete a folder and unlink its notes

### AI (`/api/ai`)
- `POST /summarize` - Summarize provided text
- `POST /tags` - Extract tags from provided text