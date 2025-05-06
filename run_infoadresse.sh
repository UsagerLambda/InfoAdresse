#!/bin/bash

# Définir des couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher des messages d'information
info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Fonction pour afficher des messages de succès
success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Fonction pour afficher des avertissements
warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Fonction pour afficher des erreurs
error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    error "Docker n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
fi

# Afficher un message de bienvenue
echo -e "\n${GREEN}=== InfoAdresse - Système de lancement ===${NC}\n"

# Vérifier si le fichier docker-compose.yml existe
if [ ! -f "docker-compose.yml" ]; then
    error "Le fichier docker-compose.yml n'a pas été trouvé dans le répertoire courant."
    exit 1
fi

# Menu des options
show_menu() {
    echo -e "\nQue souhaitez-vous faire ?"
    echo "1. Lancer l'application complète (frontend + backend)"
    echo "2. Lancer uniquement le backend"
    echo "3. Lancer uniquement le frontend"
    echo "4. Arrêter tous les conteneurs"
    echo "5. Voir les logs"
    echo "6. Reconstruire les images"
    echo "7. Nettoyer (supprimer images, volumes et conteneurs)"
    echo "8. Quitter"
    echo -n "Votre choix (1-8): "
    read choice
}

# Fonction pour lancer l'application complète
start_all() {
    info "Démarrage de l'application complète..."
    if docker-compose up -d; then
        success "L'application est lancée !"
        echo -e "\nAccès aux applications:"
        echo -e "- Frontend: ${BLUE}http://localhost:5173${NC}"
        echo -e "- Backend API: ${BLUE}http://localhost:8000${NC}"
    else
        error "Une erreur s'est produite lors du démarrage de l'application."
    fi
}

# Fonction pour lancer uniquement le backend
start_backend() {
    info "Démarrage du backend..."
    if docker-compose up -d backend; then
        success "Le backend est lancé !"
        echo -e "- Backend API: ${BLUE}http://localhost:8000${NC}"
    else
        error "Une erreur s'est produite lors du démarrage du backend."
    fi
}

# Fonction pour lancer uniquement le frontend
start_frontend() {
    info "Démarrage du frontend..."
    if docker-compose up -d frontend; then
        success "Le frontend est lancé !"
        echo -e "- Frontend: ${BLUE}http://localhost:5173${NC}"
    else
        error "Une erreur s'est produite lors du démarrage du frontend."
    fi
}

# Fonction pour arrêter tous les conteneurs
stop_all() {
    info "Arrêt de tous les conteneurs..."
    if docker-compose down; then
        success "Tous les conteneurs ont été arrêtés."
    else
        error "Une erreur s'est produite lors de l'arrêt des conteneurs."
    fi
}

# Fonction pour voir les logs
view_logs() {
    echo -e "\nQuels logs souhaitez-vous voir ?"
    echo "1. Tous les logs"
    echo "2. Logs du backend"
    echo "3. Logs du frontend"
    echo -n "Votre choix (1-3): "
    read log_choice

    case $log_choice in
        1)
            docker-compose logs -f
            ;;
        2)
            docker-compose logs -f backend
            ;;
        3)
            docker-compose logs -f frontend
            ;;
        *)
            warning "Choix invalide"
            ;;
    esac
}

# Fonction pour reconstruire les images
rebuild_images() {
    info "Reconstruction des images Docker..."
    if docker-compose build --no-cache; then
        success "Les images ont été reconstruites avec succès."
    else
        error "Une erreur s'est produite lors de la reconstruction des images."
    fi
}

# Fonction pour nettoyer (supprimer images, volumes et conteneurs)
clean_all() {
    info "Nettoyage en cours..."
    warning "Cette action va supprimer tous les conteneurs, images et volumes liés à cette application."
    echo -n "Êtes-vous sûr de vouloir continuer ? (o/n): "
    read confirm

    if [ "$confirm" == "o" ] || [ "$confirm" == "O" ]; then
        docker-compose down -v
        docker-compose rm -f
        # Supprimer les images du projet
        docker images | grep 'infoadresse' | awk '{print $3}' | xargs -r docker rmi
        success "Nettoyage terminé."
    else
        info "Nettoyage annulé."
    fi
}

# Boucle principale
while true; do
    show_menu
    case $choice in
        1)
            start_all
            ;;
        2)
            start_backend
            ;;
        3)
            start_frontend
            ;;
        4)
            stop_all
            ;;
        5)
            view_logs
            ;;
        6)
            rebuild_images
            ;;
        7)
            clean_all
            ;;
        8)
            echo -e "\n${GREEN}Au revoir !${NC}"
            exit 0
            ;;
        *)
            warning "Choix invalide. Veuillez sélectionner une option entre 1 et 8."
            ;;
    esac
    
    echo -e "\nAppuyez sur Entrée pour revenir au menu principal..."
    read
    clear
done
