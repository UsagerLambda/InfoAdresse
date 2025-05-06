# InfoAdresse
Plateforme qui transforme une adresse en profil immobilier complet. Analyse le cadastre, PLU, géorisques et données locales. Développements futurs: analyse d'ensoleillement par IA et extraction intelligente de documents. Facilite l'accès aux données immobilières françaises.

## Instructions pour lancer le serveur

Pour faire fonctionner correctement l'application, vous devez suivre ces étapes :

1. **Ouvrir deux terminaux distincts**

2. **Dans le premier terminal :**
   - Naviguer vers le dossier backend
   - Exécuter la commande suivante :
   ```
   ./run.sh
   ```

3. **Dans le deuxième terminal :**
   - Naviguer vers le dossier frontend
   - Exécuter la commande suivante :
   ```
   yarn run dev --host
   ```

5. **Accéder à l'application :**
   - Ouvrir votre navigateur internet
   - Saisir l'adresse IP indiquée après "Network:" dans le terminal
   - L'application devrait maintenant être accessible

Assurez-vous que les deux terminaux restent ouverts pendant toute l'utilisation de l'application.


### Diagrammes :

1. **Diagramme de séquence pour la recherche d'adresse**


```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant ExternalAPIs

    User->>Frontend: Saisit une adresse
    Frontend->>Backend: GET /search
    Backend->>ExternalAPIs: Appel API Adresse
    ExternalAPIs-->>Backend: Résultat
    Backend->>ExternalAPIs: Appel cadastre
    ExternalAPIs-->>Backend: Résultat
    Backend->>ExternalAPIs: Appel georisques
    ExternalAPIs-->>Backend: Résultat
    Backend->>ExternalAPIs: Appel demographie
    ExternalAPIs-->>Backend: Résultat
    Backend->>ExternalAPIs: Appel PLU
    ExternalAPIs-->>Backend: Résultat
    Backend-->>Frontend: Réponse consolidée
    Frontend-->>User: Affichage résultats

    alt Utilisateur connecté
        Frontend->>Backend: POST /api/v1/auth/history_add/{user_id}
        Backend-->>Frontend: Confirmation ajout historique
    end
```

2. **Diagramme de séquence pour la connexion de l'utilisateur**

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend

    User->>Frontend: Saisit identifiants
    Frontend->>Backend: POST /api/v1/auth/login

    Backend->>Backend: Vérifie identifiants
    Backend->>Backend: Génère JWT token

    Backend-->>Frontend: Retourne token JWT
    Frontend->>Frontend: Sauvegarde token (localStorage)

    Frontend->>Backend: GET /api/v1/auth/me
    Backend-->>Frontend: Informations profil
    Frontend->>Frontend: Sauvegarde les informations (localStorage)
    Frontend-->>User: Redirige vers accueil
```

3. **Schéma de la base de données**

```mermaid
erDiagram
    USERS {
        string id PK
        string first_name
        string last_name
        string email
        string password
        json history
        boolean is_admin
    }
```

4. **Architecture globale**

```mermaid
flowchart TD
    subgraph "Frontend React/TypeScript"
        FC[Components]
        FP[Pages]
        FS[Services]
    end

    subgraph "Backend FastAPI"
        BM[Models]
        BA[API Endpoints]
        BS[Services]
        BD[Database]
    end

    subgraph "External APIs"
        EA[API Adresse]
        EC[API Cadastre]
        EG[API Georisques]
        ED[API Demographie]
        EP[API PLU]
    end

    FC -->|Uses| FS
    FP -->|Uses| FC

    FS -->|HTTP| BA

    BS -->|Uses| BM
    BA -->|Uses| BS
    BS -->|Uses| BD

    BS -->|HTTP| EA
    BS -->|HTTP| EC
    BS -->|HTTP| EG
    BS -->|HTTP| ED
    BS -->|HTTP| EP
```
