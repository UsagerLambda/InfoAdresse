#!/bin/bash

# Vérifie si le dossier venv existe
if [ -d "venv" ]; then
    echo "Environnement virtuel détecté. Activation..."
else
    echo "Aucun environnement virtuel trouvé. Création..."
    python3 -m venv venv || { echo "Erreur lors de la création de l'environnement virtuel."; exit 1; }
fi

# Activation de l'environnement virtuel
source venv/bin/activate || { echo "Échec de l'activation de l'environnement virtuel."; exit 1; }

# Vérifie et installe les dépendances
if [ -f "requirements.txt" ]; then
    echo "Installation des dépendances..."
    pip install --upgrade pip
    pip install -r requirements.txt || { echo "Erreur lors de l'installation des dépendances."; exit 1; }
else
    echo "Fichier requirements.txt introuvable. Installation annulée."
    exit 1
fi

# Lance Uvicorn en arrière-plan
echo "Démarrage de l'application avec Uvicorn..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &

# Donne un peu de temps à Uvicorn pour démarrer
sleep 3

# Nettoyage des __pycache__ en parallèle
echo "Nettoyage des fichiers __pycache__..."
find . -type d -name '__pycache__' -exec rm -r {} + &

# Attend la fin de tous les processus
wait

# Dernier nettoyage par sécurité
find . -type d -name '__pycache__' -exec rm -r {} +

echo "Script terminé."
