from sqlalchemy import Column, String, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(120), nullable=False, unique=True)
    history = Column(JSON, nullable=True)
    password = Column(String(128), nullable=False)
    is_admin = Column(Boolean, default=False)

    def __init__(self, **kwargs):
        self.first_name = kwargs.get('first_name')
        self.last_name = kwargs.get('last_name')
        self.email = kwargs.get('email')
        self.is_admin = kwargs.get('is_admin', False)
        self.history = kwargs.get('history', [])
        self.hash_password(kwargs.get('password'))

    def hash_password(self, password): # fonction de hashage
        self.password = generate_password_hash(password)

    def verify_password(self, password): # compare deux mdp hashé
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email
        }

    def to_dict_history(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'history': self.history if self.history is not None else []
        }

    def add_to_history(self, item):
        if self.history is None:
            self.history = []
        self.history.append(item)
