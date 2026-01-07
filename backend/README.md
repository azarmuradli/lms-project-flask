# LMS Backend - FastAPI

A Learning Management System backend built with FastAPI, featuring JWT authentication, role-based access control, and complete CRUD operations for subjects, tasks, and solutions.

## Features

- JWT-based authentication
- Role-based access (Teachers & Students)
- Subject management (CRUD with soft delete)
- Task creation and management
- Solution submission and evaluation
- Student enrollment system
- Input validation and authorization

## Tech Stack

- **Framework**: FastAPI
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: SQLAlchemy 2.0
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)
- **Validation**: Pydantic

## Prerequisites

- Python 3.10+
- pip

## Installation

1. **Navigate to backend folder:**
```bash
   cd backend
```

2. **Create virtual environment:**
```bash
   python -m venv venv
```

3. **Activate virtual environment:**
   - Windows:
```bash
     venv\Scripts\activate
```
   - Mac/Linux:
```bash
     source venv/bin/activate
```

4. **Install dependencies:**
```bash
   pip install -r requirements.txt
```

5. **Create `.env` file:**
```bash
   cp .env.example .env
```
   
   Edit `.env` and set your environment variables:
```
   DATABASE_URL=sqlite:///./lms.db
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Running the Application

1. **Seed the database with teachers:**
```bash
   python seed.py
```
   
   This creates 2 teacher accounts:
   - Email: `teacher1@test.com`, Password: `teacher123`
   - Email: `teacher2@test.com`, Password: `teacher123`

2. **Start the development server:**
```bash
   uvicorn app.main:app --reload
```

3. **Access the API:**
   - API: http://localhost:8000
   - Interactive Docs: http://localhost:8000/docs
   - Alternative Docs: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login (returns JWT token)
- `GET /api/auth/me` - Get current user info

### Teacher Routes
- `GET /api/teacher/subjects` - Get teacher's subjects
- `POST /api/teacher/subjects` - Create new subject
- `GET /api/teacher/subjects/{id}` - Get subject details with students
- `PUT /api/teacher/subjects/{id}` - Update subject
- `DELETE /api/teacher/subjects/{id}` - Soft delete subject
- `POST /api/teacher/subjects/{id}/tasks` - Create task
- `GET /api/teacher/subjects/{id}/tasks` - Get all tasks for subject
- `PUT /api/teacher/tasks/{id}` - Update task
- `GET /api/teacher/tasks/{id}` - Get task with stats
- `GET /api/teacher/tasks/{id}/solutions` - Get all solutions for task
- `POST /api/teacher/solutions/{id}/evaluate` - Evaluate solution

### Student Routes
- `GET /api/student/subjects` - Get all available subjects
- `GET /api/student/my-subjects` - Get enrolled subjects
- `POST /api/student/subjects/{id}/enroll` - Enroll in subject
- `DELETE /api/student/subjects/{id}/leave` - Leave subject
- `GET /api/student/subjects/{id}/tasks` - Get tasks for enrolled subject
- `POST /api/student/tasks/{id}/submit` - Submit solution
- `GET /api/student/tasks/{id}/my-solutions` - Get my submissions

## Database Schema

### User
- id, username, email, hashed_password, is_teacher, created_at

### Subject
- id, name, description, code, credits, teacher_id, created_at, updated_at, deleted_at

### Task
- id, name, description, points, subject_id, created_at, updated_at

### Solution
- id, content, task_id, student_id, points_earned, submitted_at, evaluated_at

## Deployment

For production deployment:

1. **Use PostgreSQL:**
```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
```

2. **Generate secure secret key:**
```python
   import secrets
   print(secrets.token_urlsafe(32))
```

3. **Deploy to Railway/Render/Heroku**

## Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py          # Configuration settings
│   ├── database.py        # Database connection
│   ├── models.py          # SQLAlchemy models
│   ├── schemas.py         # Pydantic schemas
│   ├── auth.py            # Authentication utilities
│   ├── main.py            # FastAPI application
│   └── routers/
│       ├── __init__.py
│       ├── auth.py        # Auth endpoints
│       ├── teachers.py    # Teacher endpoints
│       └── students.py    # Student endpoints
├── seed.py                # Database seeding script
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
└── README.md             # This file
```

## License

MIT