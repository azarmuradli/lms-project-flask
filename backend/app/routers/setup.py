from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, auth
from ..database import get_db

router = APIRouter()

@router.post("/seed-teachers")
def seed_teachers(db: Session = Depends(get_db)):
    # Check if teachers already exist
    existing = db.query(models.User).filter(models.User.is_teacher == True).first()
    if existing:
        return {"message": "Teachers already exist"}
    
    # Create teachers
    teachers = [
        {"username": "teacher1", "email": "teacher1@test.com", "password": "teacher123"},
        {"username": "teacher2", "email": "teacher2@test.com", "password": "teacher123"}
    ]
    
    for t in teachers:
        teacher = models.User(
            username=t["username"],
            email=t["email"],
            hashed_password=auth.get_password_hash(t["password"]),
            is_teacher=True
        )
        db.add(teacher)
    
    db.commit()
    return {"message": "Successfully created 2 teachers"}