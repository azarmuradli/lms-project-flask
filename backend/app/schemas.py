from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from typing import List

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    is_teacher: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None



# Subject Schemas
class SubjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    code: str
    credits: int

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int
    teacher_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class SubjectWithStudents(Subject):
    students: List[User] = []

# Task Schemas
class TaskBase(BaseModel):
    name: str
    description: str
    points: int

class TaskCreate(TaskBase):
    subject_id: int

class TaskUpdate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    subject_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TaskWithStats(Task):
    total_solutions: int = 0
    evaluated_solutions: int = 0


# Solution Schemas
class SolutionBase(BaseModel):
    content: str

class SolutionCreate(SolutionBase):
    task_id: int

class SolutionEvaluate(BaseModel):
    points_earned: int

class Solution(SolutionBase):
    id: int
    task_id: int
    student_id: int
    points_earned: Optional[int] = None
    submitted_at: datetime
    evaluated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True