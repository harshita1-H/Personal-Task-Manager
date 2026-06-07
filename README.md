# Task Manager

A full-stack task management app built with Node.js + Express (backend) and React + Vite (frontend).

## Tech Stack
- **Backend:** Node.js, Express, UUID, file-based JSON storage
- **Frontend:** React 18, Vite, functional components with hooks

## How to Run Locally

### 1. Start the backend
```bash
cd server
npm install
npm run dev
```
Server runs on http://localhost:5000

### 2. Start the frontend
```bash
cd client
npm install
npm run dev
```
App runs on http://localhost:5173

## API Documentation

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | /api/tasks | — | Get all tasks (newest first) |
| POST | /api/tasks | `{ title, description?, dueDate? }` | Create a task |
| PUT | /api/tasks/:id | `{ title?, description?, dueDate?, completed? }` | Update a task |
| DELETE | /api/tasks/:id | — | Delete a task |

## Project Structure
```
task-manager/
├── server/
│   ├── index.js          # Express app setup
│   ├── routes/tasks.js   # All task CRUD routes
│   └── data/tasks.json   # JSON file storage
└── client/
    └── src/
        ├── App.jsx
        ├── hooks/useTasks.js         # API calls + state
        └── components/
            ├── TaskForm.jsx
            ├── TaskList.jsx
            ├── TaskItem.jsx
            └── FilterBar.jsx
```

## Next Steps
- Add search by title
- Add drag-and-drop reorder
- Add user authentication
- Migrate storage to SQLite or PostgreSQL
