from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

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

# Configuration SlowAPI
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
