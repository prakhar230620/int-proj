# Notes App - Project Description

## Introduction

Notes App ek full stack web application hai jo users ko apne personal notes create, edit, view aur delete karne ki permission deta hai. Ye MERN stack (MongoDB, Express.js, React.js, Node.js) ka use karke banaya gaya hai aur isme user authentication, notes management aur theme changing jaise features hain.

## Technical Stack

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: Database
- **Mongoose**: MongoDB object modeling tool
- **JWT (JSON Web Tokens)**: User authentication ke liye
- **bcryptjs**: Password hashing ke liye
- **express-validator**: Input validation ke liye

### Frontend
- **React.js**: User interface library
- **React Router**: Client-side routing ke liye
- **Context API**: State management ke liye
- **Axios**: HTTP requests ke liye
- **CSS**: Styling ke liye

## Project Structure

### Backend (Server)

```
server/
├── config/
│   ├── db.js            # MongoDB connection
│   └── default.json     # Configuration
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── models/
│   ├── Note.js          # Note model
│   └── User.js          # User model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── notes.js         # Notes routes
│   └── users.js         # User routes
└── server.js           # Main server file
```

### Frontend (Client)

```
client/
├── public/
│   ├── index.html       # HTML template
│   └── ...              # Other static files
└── src/
    ├── components/
    │   ├── Auth/        # Login aur Register components
    │   ├── Home/        # Home page components
    │   ├── Layout/      # Layout components (navbar)
    │   └── Notes/       # Notes related components
    ├── context/
    │   ├── AuthContext.js  # Authentication context
    │   ├── NoteContext.js  # Notes context
    │   └── ThemeContext.js # Theme context
    ├── App.js           # Main app component
    └── index.js         # App entry point
```

## Main Features

### User Management
1. **Registration**: New users apna name, email aur password dekar register kar sakte hain.
2. **Login**: Registered users apne email aur password se login kar sakte hain.
3. **Authentication**: JWT ka use karke secure authentication.

### Notes Management
1. **View Notes**: Users apne saare notes dekh sakte hain.
2. **Create Note**: Users title, description aur color ke saath new notes create kar sakte hain.
3. **Edit Note**: Users apne existing notes ko edit kar sakte hain.
4. **Delete Note**: Users apne notes delete kar sakte hain.
5. **Filter Notes**: Users title ya description ke basis par notes filter kar sakte hain.

### Other Features
1. **Dark Mode**: Users light aur dark theme ke beech switch kar sakte hain.
2. **Responsive Design**: Mobile aur desktop dono par achha kaam karta hai.

## API Endpoints

### User aur Authentication
- `POST /api/users`: New user register kare
- `POST /api/auth`: User login kare
- `GET /api/auth`: Logged in user ki information retrieve kare

### Notes
- `GET /api/notes`: User ke saare notes retrieve kare
- `POST /api/notes`: New note create kare
- `PUT /api/notes/:id`: Existing note update kare
- `DELETE /api/notes/:id`: Note delete kare

## Database Models

### User Model
```javascript
const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
```

### Note Model
```javascript
const NoteSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, default: "#ffffff" },
  date: { type: Date, default: Date.now }
});
```

## Flow

### User Authentication Flow
1. User register ya login karta hai
2. Server JWT token issue karta hai
3. Client token ko local storage mein store karta hai
4. Har API request ke saath token bheja jata hai
5. Server token ko verify karta hai aur request ko process karta hai

### Notes Management Flow
1. User home page par navigate karta hai
2. App user ke notes load karta hai
3. User notes dekh sakta hai, new notes create kar sakta hai, existing notes ko edit ya delete kar sakta hai
4. Saare changes real-time mein database mein update hote hain

## Security Features

1. **Password Hashing**: bcryptjs ka use karke passwords hash kiye jate hain
2. **JWT Authentication**: Secure API endpoints ke liye
3. **Private Routes**: Sirf authenticated users hi sensitive data access kar sakte hain
4. **Input Validation**: express-validator ka use karke saare user inputs ka validation

## Conclusion

Notes App ek modern, secure aur user-friendly web application hai jo MERN stack ka use karta hai. Ye users ko apne personal notes ko effectively manage karne ki permission deta hai, jisme user authentication, notes management aur theme changing jaise features shamil hain.