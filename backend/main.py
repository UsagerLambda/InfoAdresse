from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import get, auth, protected
from core.database import engine
from app.models.user import Base
from core.config import CORS_ORIGINS, ALLOWED_ORIGINS

Base.metadata.create_all(bind=engine)

# Initialise l'app
app = FastAPI(
        title="API InfoAdresse",
        description="API du service web InfoAdresse",
        version="1.0.0"
    )

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router déclarés dans d'autres fichiers
app.include_router(get.router)
app.include_router(auth.router)
app.include_router(protected.router)
