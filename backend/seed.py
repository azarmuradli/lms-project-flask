from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash

def seed_database():
    db = SessionLocal()
    
    try:
        # Check if teachers already exist
        existing_teacher = db.query(User).filter(User.is_teacher == True).first()
        if existing_teacher:
            print("Teachers already exist in database!")
            return
        
        # Create teacher accounts
        teachers = [
            {
                "username": "teacher1",
                "email": "teacher1@test.com",
                "password": "teacher123",
                "is_teacher": True
            },
            {
                "username": "teacher2",
                "email": "teacher2@test.com",
                "password": "teacher123",
                "is_teacher": True
            }
        ]
        
        for teacher_data in teachers:
            teacher = User(
                username=teacher_data["username"],
                email=teacher_data["email"],
                hashed_password=get_password_hash(teacher_data["password"]),
                is_teacher=teacher_data["is_teacher"]
            )
            db.add(teacher)
        
        db.commit()
        print("✅ Successfully seeded 2 teachers!")
        print("\nTeacher credentials:")
        print("Email: teacher1@test.com, Password: teacher123")
        print("Email: teacher2@test.com, Password: teacher123")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()