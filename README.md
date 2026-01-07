# Learning Management System (LMS)

## Live Demo

**Frontend:** https://lms-project-flask-kohl.vercel.app  
**Backend API:** https://lms-project-flask-production.up.railway.app  
**API Documentation:** https://lms-project-flask-production.up.railway.app/docs

### Test Credentials

**Teacher Account:**
- Email: `teacher1@test.com`
- Password: `teacher123`

**Student Account:**
- Register a new account via the application

---

## Overview

A full-stack Learning Management System with role-based access for teachers and students, featuring subject management, task creation, solution submission, and evaluation.

This LMS allows:
- **Teachers** to create subjects, assign tasks, and evaluate student submissions
- **Students** to enroll in subjects, view tasks, and submit solutions

## Project Structure
```
lms/
├── backend/          # FastAPI backend
│   ├── app/
│   ├── seed.py
│   ├── requirements.txt
│   └── README.md
├── frontend/         # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── README.md
└── README.md         # This file
```

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy 2.0
- PostgreSQL (production) / SQLite (development)
- JWT Authentication
- Python 3.10+

### Frontend
- React 18
- Vite
- Tailwind CSS v4
- React Router v6
- Axios

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip and npm

### 1. Setup Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload
```

Backend will run at: http://localhost:8000

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: http://localhost:5173

### 3. Access the Application

Open http://localhost:5173 in your browser.

**Default Teacher Credentials:**
- Email: `teacher1@test.com`
- Password: `teacher123`

**Students:**
- Register new accounts via the Register page

## Features

### Teacher Features
- Create and manage subjects
- Create tasks with point values
- View enrolled students
- Evaluate student solutions
- Track submission statistics

### Student Features
- Browse and enroll in subjects
- View tasks for enrolled subjects
- Submit solutions (multiple submissions allowed)
- View evaluation scores
- Track submission history

### General Features
- JWT-based authentication
- Role-based access control
- Responsive design (mobile + desktop)
- Dark theme UI
- Toast notifications
- Confirmation modals

## Documentation

For detailed setup and deployment instructions, see:
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## API Documentation

Once the backend is running, access:
- Interactive API Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

## Deployment

### Backend
Deployed to Railway with PostgreSQL database.

### Frontend
Deployed to Vercel.

See individual README files for detailed deployment instructions.

## License

MIT