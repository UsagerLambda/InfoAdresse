import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration de l'application
APP_ENV = os.getenv("APP_ENV", "development")
DEBUG = APP_ENV == "development"

# Configuration de sécurité
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Configuration de la base de données
if APP_ENV == "production":
    DATABASE_URL = os.getenv("DATABASE_URL", "")
else:
    DATABASE_URL = 'sqlite:///./development.db'

# Configuration CORS
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost,http://localhost:8080,http://localhost:3000,http://localhost:5173").split(",")
