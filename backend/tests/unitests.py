import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
from fastapi.testclient import TestClient

# Import AVANT de créer l'app pour s'assurer que tous les modèles sont chargés
from app.models import User, Base
from core.database import engine, get_db, SessionLocal
from main import app

# Créer les tables dans la base de données de test
Base.metadata.create_all(bind=engine)

class TestAPI(unittest.TestCase):
    def setUp(self):
        """Configuration avant chaque test"""
        self.client = TestClient(app)
        # Nettoyer la base de données avant chaque test
        db = SessionLocal()
        db.query(User).delete()
        db.commit()
        db.close()
        
    def test_create_user(self):
        """Test de création d'un utilisateur via endpoint"""
        response = self.client.post(
            "/api/v1/auth/register",
            json={
                "first_name": "Jean",
                "last_name": "Dupont",
                "email": "jean.dupont@example.com",
                "password": "password123",
                "history": []
            }
        )
        
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["message"], "Utilisateur enregistré avec succès !")
        
        # Vérifier que l'utilisateur existe bien dans la base
        db = SessionLocal()
        user = db.query(User).filter(User.email == "jean.dupont@example.com").first()
        self.assertIsNotNone(user)
        self.assertEqual(user.first_name, "Jean")
        db.close()

    def test_login(self):
        """Test de login d'un utilisateur via endpoint"""
        # D'abord créer un utilisateur
        self.client.post(
            "/api/v1/auth/register",
            json={
                "first_name": "Alice",
                "last_name": "Martin",
                "email": "alice.martin@example.com",
                "password": "secret123",
                "history": []
            }
        )

        # Tenter de se connecter avec les bonnes credentials
        response = self.client.post(
            "/api/v1/auth/login",
            data={
                "username": "alice.martin@example.com",
                "password": "secret123"
            }
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["token_type"], "bearer")

        # Tester avec un mauvais mot de passe
        response = self.client.post(
            "/api/v1/auth/login",
            data={
                "username": "alice.martin@example.com",
                "password": "wrongpassword"
            }
        )

        self.assertEqual(response.status_code, 401)

    def tearDown(self):
        """Nettoyage après chaque test"""
        # Nettoyer la base de données après chaque test
        db = SessionLocal()
        db.query(User).delete()
        db.commit()
        db.close()

if __name__ == '__main__':
    unittest.main()
