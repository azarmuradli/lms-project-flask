from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# Association table for many-to-many relationship between students and subjects
student_subjects = Table(
    'student_subjects',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('subject_id', Integer, ForeignKey('subjects.id'), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_teacher = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    taught_subjects = relationship("Subject", back_populates="teacher")
    enrolled_subjects = relationship("Subject", secondary=student_subjects, back_populates="students")
    solutions = relationship("Solution", back_populates="student")


class Subject(Base):
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    code = Column(String, unique=True, nullable=False)
    credits = Column(Integer, nullable=False)
    teacher_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    teacher = relationship("User", back_populates="taught_subjects")
    students = relationship("User", secondary=student_subjects, back_populates="enrolled_subjects")
    tasks = relationship("Task", back_populates="subject")


class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    points = Column(Integer, nullable=False)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    subject = relationship("Subject", back_populates="tasks")
    solutions = relationship("Solution", back_populates="task")


class Solution(Base):
    __tablename__ = "solutions"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    task_id = Column(Integer, ForeignKey('tasks.id'), nullable=False)
    student_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    points_earned = Column(Integer, nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    evaluated_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    task = relationship("Task", back_populates="solutions")
    student = relationship("User", back_populates="solutions")