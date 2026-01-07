from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter()

def get_current_teacher(current_user: models.User = Depends(auth.get_current_user)):
    if not current_user.is_teacher:
        raise HTTPException(status_code=403, detail="Only teachers can access this")
    return current_user

# Get all subjects for the logged-in teacher
@router.get("/subjects", response_model=List[schemas.Subject])
def get_my_subjects(
    current_teacher: models.User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    subjects = db.query(models.Subject).filter(
        models.Subject.teacher_id == current_teacher.id,
        models.Subject.deleted_at == None
    ).all()
    return subjects

# Create a new subject
@router.post("/subjects", response_model=schemas.Subject, status_code=status.HTTP_201_CREATED)
def create_subject(
    subject: schemas.SubjectCreate,
    current_teacher: models.User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    # Check if code already exists
    existing = db.query(models.Subject).filter(models.Subject.code == subject.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Subject code already exists")
    
    new_subject = models.Subject(
        **subject.dict(),
        teacher_id=current_teacher.id
    )
    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)
    return new_subject



# Get a specific subject
@router.get("/subjects/{subject_id}", response_model=schemas.SubjectWithStudents)
def get_subject(
    subject_id: int,
    current_teacher: models.User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.teacher_id == current_teacher.id,
        models.Subject.deleted_at == None
    ).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

# Update a subject
@router.put("/subjects/{subject_id}", response_model=schemas.Subject)
def update_subject(
    subject_id: int,
    subject_update: schemas.SubjectUpdate,
    current_teacher: models.User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.teacher_id == current_teacher.id,
        models.Subject.deleted_at == None
    ).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    for key, value in subject_update.dict().items():
        setattr(subject, key, value)
    
    db.commit()
    db.refresh(subject)
    return subject

# Delete a subject (soft delete)
@router.delete("/subjects/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(
    subject_id: int,
    current_teacher: models.User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    from datetime import datetime
    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.teacher_id == current_teacher.id,
        models.Subject.deleted_at == None
    ).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    subject.deleted_at = datetime.utcnow()
    db.commit()
    return None



# Create a task for a subject
@router.post("/subjects/{subject_id}/tasks", response_model=schemas.Task, status_code=status.HTTP_201_CREATED)
def create_task(
    subject_id: int,
    task: schemas.TaskCreate,
    current_teacher: models.User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    # Verify subject belongs to teacher
    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.teacher_id == current_teacher.id,
        models.Subject.deleted_at == None
    ).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    new_task = models.Task(**task.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

# Get all tasks for a subject
@router.get("/subjects/{subject_id}/tasks", response_model=List[schemas.Task])
def get_tasks(
    subject_id: int,
    current_teacher: models.User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    # Verify subject belongs to teacher
    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.teacher_id == current_teacher.id,
        models.Subject.deleted_at == None
    ).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    tasks = db.query(models.Task).filter(models.Task.subject_id == subject_id).all()
    return tasks

# Update a task
@router.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task(
    task_id: int,
    task_update: schemas.TaskUpdate,
    current_teacher: models.User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Verify subject belongs to teacher
    subject = db.query(models.Subject).filter(
        models.Subject.id == task.subject_id,
        models.Subject.teacher_id == current_teacher.id
    ).first()
    if not subject:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    for key, value in task_update.dict().items():
        setattr(task, key, value)
    
    db.commit()
    db.refresh(task)
    return task



# Get all solutions for a task
@router.get("/tasks/{task_id}/solutions", response_model=List[schemas.Solution])
def get_task_solutions(
    task_id: int,
    current_teacher: models.User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Verify subject belongs to teacher
    subject = db.query(models.Subject).filter(
        models.Subject.id == task.subject_id,
        models.Subject.teacher_id == current_teacher.id
    ).first()
    if not subject:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    solutions = db.query(models.Solution).filter(models.Solution.task_id == task_id).all()
    return solutions

# Evaluate a solution
@router.post("/solutions/{solution_id}/evaluate", response_model=schemas.Solution)
def evaluate_solution(
    solution_id: int,
    evaluation: schemas.SolutionEvaluate,
    current_teacher: models.User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    from datetime import datetime
    
    solution = db.query(models.Solution).filter(models.Solution.id == solution_id).first()
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    # Verify task belongs to teacher's subject
    task = db.query(models.Task).filter(models.Task.id == solution.task_id).first()
    subject = db.query(models.Subject).filter(
        models.Subject.id == task.subject_id,
        models.Subject.teacher_id == current_teacher.id
    ).first()
    if not subject:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Validate points
    if evaluation.points_earned < 0 or evaluation.points_earned > task.points:
        raise HTTPException(status_code=400, detail=f"Points must be between 0 and {task.points}")
    
    solution.points_earned = evaluation.points_earned
    solution.evaluated_at = datetime.utcnow()
    db.commit()
    db.refresh(solution)
    return solution


# Get task details with stats
@router.get("/tasks/{task_id}", response_model=schemas.TaskWithStats)
def get_task_details(
    task_id: int,
    current_teacher: models.User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Verify subject belongs to teacher
    subject = db.query(models.Subject).filter(
        models.Subject.id == task.subject_id,
        models.Subject.teacher_id == current_teacher.id
    ).first()
    if not subject:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Count solutions
    total_solutions = db.query(models.Solution).filter(
        models.Solution.task_id == task_id
    ).count()
    
    evaluated_solutions = db.query(models.Solution).filter(
        models.Solution.task_id == task_id,
        models.Solution.points_earned != None
    ).count()
    
    # Create response with stats
    task_dict = {
        "id": task.id,
        "name": task.name,
        "description": task.description,
        "points": task.points,
        "subject_id": task.subject_id,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
        "total_solutions": total_solutions,
        "evaluated_solutions": evaluated_solutions
    }
    
    return task_dict