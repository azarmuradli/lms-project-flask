from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, teachers, students

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LMS API",
    description="Learning Management System API",
    version="1.0.0"
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(teachers.router, prefix="/api/teacher", tags=["Teacher"])
app.include_router(students.router, prefix="/api/student", tags=["Student"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to LMS API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}