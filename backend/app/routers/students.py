from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter()

def get_current_student(current_user: models.User = Depends(auth.get_current_user)):
    if current_user.is_teacher:
        raise HTTPException(status_code=403, detail="Only students can access this")
    return current_user

# Get all available subjects
@router.get("/subjects", response_model=List[schemas.Subject])
def get_all_subjects(db: Session = Depends(get_db)):
    subjects = db.query(models.Subject).filter(models.Subject.deleted_at == None).all()
    return subjects

# Get subjects enrolled by the student
@router.get("/my-subjects", response_model=List[schemas.Subject])
def get_my_subjects(
    current_student: models.User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    return current_student.enrolled_subjects

# Enroll in a subject
@router.post("/subjects/{subject_id}/enroll", status_code=status.HTTP_200_OK)
def enroll_in_subject(
    subject_id: int,
    current_student: models.User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.deleted_at == None
    ).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Check if already enrolled
    if subject in current_student.enrolled_subjects:
        raise HTTPException(status_code=400, detail="Already enrolled in this subject")
    
    current_student.enrolled_subjects.append(subject)
    db.commit()
    return {"message": "Successfully enrolled in subject"}

# Leave a subject
@router.delete("/subjects/{subject_id}/leave", status_code=status.HTTP_200_OK)
def leave_subject(
    subject_id: int,
    current_student: models.User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    if subject not in current_student.enrolled_subjects:
        raise HTTPException(status_code=400, detail="Not enrolled in this subject")
    
    current_student.enrolled_subjects.remove(subject)
    db.commit()
    return {"message": "Successfully left subject"}



# Get tasks for a subject
@router.get("/subjects/{subject_id}/tasks", response_model=List[schemas.Task])
def get_subject_tasks(
    subject_id: int,
    current_student: models.User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.deleted_at == None
    ).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Check if student is enrolled
    if subject not in current_student.enrolled_subjects:
        raise HTTPException(status_code=403, detail="You must be enrolled in this subject")
    
    tasks = db.query(models.Task).filter(models.Task.subject_id == subject_id).all()
    return tasks

# Submit a solution for a task
@router.post("/tasks/{task_id}/submit", response_model=schemas.Solution, status_code=status.HTTP_201_CREATED)
def submit_solution(
    task_id: int,
    solution: schemas.SolutionCreate,
    current_student: models.User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check if student is enrolled in the subject
    subject = db.query(models.Subject).filter(models.Subject.id == task.subject_id).first()
    if subject not in current_student.enrolled_subjects:
        raise HTTPException(status_code=403, detail="You must be enrolled in this subject")
    
    new_solution = models.Solution(
        content=solution.content,
        task_id=task_id,
        student_id=current_student.id
    )
    db.add(new_solution)
    db.commit()
    db.refresh(new_solution)
    return new_solution

# Get my solutions for a task
@router.get("/tasks/{task_id}/my-solutions", response_model=List[schemas.Solution])
def get_my_solutions(
    task_id: int,
    current_student: models.User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    solutions = db.query(models.Solution).filter(
        models.Solution.task_id == task_id,
        models.Solution.student_id == current_student.id
    ).all()
    return solutions