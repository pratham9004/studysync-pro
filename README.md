# StudySync Pro – Smart Study Planner

A professional, modern study planner application for students to manage subjects, create study sessions, track progress, and upload notes.

## Features

- **Authentication**: Register/Login with JWT
- **Subject Management**: Add, delete, and view subjects
- **Study Sessions**: Create and manage study timetables
- **Progress Tracking**: View analytics with charts
- **Notes System**: Upload and download PDF/image notes
- **Study Streak**: Track daily study activity

## Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- Chart.js

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt
- Multer

## Prerequisites

- Node.js (v14+)
- MongoDB (local instance running on default port)

## Installation

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject
- `DELETE /api/subjects/:id` - Delete subject

### Sessions
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Upload note
- `DELETE /api/notes/:id` - Delete note

## Database

MongoDB runs locally at `mongodb://127.0.0.1:27017/studysync`

## Project Structure

```
studysync/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── main.jsx
│   └── index.html
└── README.md
```