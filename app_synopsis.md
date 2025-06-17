# NotesKeeper - Project Synopsis

## College and Student Information

### College Details
- **Institution**: IPS Academy, Indore
- **Department**: Department of Engineering and Science
- **Branch**: Computer Science and Engineering (AIML Branch)

### Student Details
1. **Name**: Prakhar Bankhede
   - **Roll Number**: 0808CL231099
   - **Year/Semester**: 3rd Year, 5th Semester
   - **Branch**: AIML

2. **Name**: Kuldeep Bunkar
   - **Roll Number**: 0808CL231080
   - **Year/Semester**: 3rd Year, 5th Semester
   - **Branch**: AIML

## Project Introduction

NotesKeeper is a comprehensive note management web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This modern solution provides users with a seamless platform to efficiently create, manage, and organize their notes. The application includes robust user authentication, role-based access control, theme customization, and a powerful administrative panel for user management.

## Technical Stack

### Frontend
- **React.js**: Main UI library
- **React Router**: Navigation and routing
- **Context API**: State management
- **CSS3**: Custom responsive styling
- **Axios**: API communication

### Backend
- **Node.js**: Server-side runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **JWT**: Authentication tokens
- **Bcrypt**: Password security

### Development Tools
- **Git**: Version control
- **npm**: Package management
- **Postman**: API testing
- **VS Code**: Development IDE

## System Architecture

The application follows a modern three-tier architecture with clear separation between client, server, and database layers.

### Client-Side Architecture
- Component-based UI architecture
- Context providers for state management
- Protected routing for authenticated users
- Responsive design implementation

### Server-Side Architecture
- RESTful API endpoints
- Middleware for authentication
- Database integration layer
- Security implementation

### Database Architecture
- User collection for authentication
- Notes collection for content
- Indexed queries for performance
- Document-based data model

## Core Features

NotesKeeper provides a comprehensive set of features designed to enhance the note-taking and management experience.

### Authentication System
- User registration with validation
- JWT-based authentication
- Password security with Bcrypt
- Protected routes for authenticated users
- Session management

### Note Management
- Note creation with color-coding
- Responsive grid layout display
- Real-time note modification
- Secure note deletion
- Search and filter functionality

### Administrative Panel
- User management dashboard
- Profile editing capabilities
- Admin rights management
- User statistics and analytics
- Account management tools

### Theme System
- Light/dark mode toggle
- Persistent theme preferences
- Consistent theme-aware styling
- Smooth transition effects

## User Flow

### Regular User Flow
1. Register/login to the application
2. View home page with note creation form and existing notes
3. Create new notes with optional color coding
4. View, edit, or delete existing notes
5. Search for specific notes using filters
6. Toggle between light and dark themes
7. Logout from the application

### Admin User Flow
1. Login with admin credentials
2. Access admin panel
3. View list of all registered users
4. Modify user information or toggle admin privileges
5. Delete user accounts if necessary
6. Navigate back to manage personal notes

## Security Implementation

### Authentication Security
- JWT tokens for session management
- Password hashing with Bcrypt
- Server-side input validation
- Protection from injection attacks

### Authorization
- Role-based access control
- Protected API endpoints
- Client-side route guards
- CORS configured for security

## Database Design

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  isAdmin: Boolean,
  bio: String,
  profilePicture: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Note Schema
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  colorTag: String,
  userId: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure

```
NotesKeeper/
├── client/                  # Frontend React application
│   ├── public/              # Static files
│   └── src/                 # Source code
│       ├── components/      # UI components
│       │   ├── Admin/       # Administrative components
│       │   ├── Auth/        # Authentication components
│       │   ├── Home/        # Home page components
│       │   ├── Layout/      # Layout components (Navbar, etc.)
│       │   └── Notes/       # Note-related components
│       ├── context/         # Context providers
│       │   ├── AuthContext.js  # Authentication state
│       │   ├── NoteContext.js  # Notes state
│       │   └── ThemeContext.js # Theme state
│       ├── App.js           # Main application component
│       └── index.js         # Entry point
└── server/                  # Backend Node.js application
    ├── config/              # Configuration files
    ├── middleware/          # Custom middleware
    ├── models/              # Database models
    ├── routes/              # API routes
    └── server.js            # Entry point
```

## Installation and Setup

### Installation Commands
```bash

#creat an empty folder on your desktop
mkdir noteskeeper

# Clone the repository in noteskeeper folder

git clone https://github.com/prakhar230620/int-proj.git

# Navigate to project directory
cd noteskeeper


# Install server dependencies
npm install

# Install client dependencies
npm run clientinstall
```

### Running the Application
```bash
# Run server only
npm run server

# Run client only
npm run client

# Run both server and client concurrently
npm run dev
```

### Environment Setup
```bash
# Create a default.json file in config folder
{
  "mongoURI": "your_mongodb_connection_string",
  "jwtSecret": "your_jwt_secret_key"
}

# For production deployment
npm run heroku-postbuild
```

## Conclusion

NotesKeeper is a comprehensive web application that demonstrates modern web development practices using the MERN stack. It provides a complete solution for note management with user authentication, admin capabilities, and theme customization. The application is designed with scalability, security, and user experience in mind, making it suitable for both personal and team use.

This project has enhanced our understanding of full-stack development, database design, security implementation, and modern JavaScript frameworks. It serves as a solid foundation for building more complex web applications and demonstrates the practical application of theoretical knowledge gained during the academic curriculum.

## Project Metrics

- **Development Time**: 1 week
- **Lines of Code**: 2,500+
- **Components**: 15+
- **API Endpoints**: 12+
- **Features**: 20+

## Developers and Institution

### Developers
1. **Prakhar Bankhede**
   - Roll Number: 0808CL231099
   - Branch: AIML

2. **Kuldeep Bunkar**
   - Roll Number: 0808CL231080
   - Branch: AIML

### Institution
- **IPS Academy, Indore**
- Department of Engineering and Science
- Computer Science and Engineering (AIML Branch)

### Academic Details
- **Academic Year**: 2025-26
- **Project Status**: Complete
- **Submission Date**: June 2025

© 2025 NotesKeeper. All rights reserved.