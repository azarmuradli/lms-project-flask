import os

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./lms.db")
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

settings = Settings()