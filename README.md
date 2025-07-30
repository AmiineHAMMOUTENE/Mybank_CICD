# MyBank - Application de Gestion Bancaire

MyBank est une application web moderne de gestion bancaire développée avec **React/Next.js** pour le frontend et **Symfony** pour le backend API.

## Fonctionnalités

- **Authentification** : Système de connexion/inscription sécurisé
- **Gestion des opérations** : Créer, modifier, supprimer des transactions
- **Catégorisation** : Organiser les opérations par catégories
- **Dashboard** : Vue d'ensemble des finances personnelles
- **API REST** : Backend Symfony avec API complète
- **Interface moderne** : Design responsive avec Tailwind CSS

##  Stack Technique

### Frontend
- **Next.js 15** (React 19)
- **TypeScript**
- **Tailwind CSS**
- **React Hook Form + Zod**
- **Axios** pour les appels API

### Backend
- **Symfony 7**
- **PHP 8.2+**
- **Doctrine ORM**
- **MySQL 8.0**
- **API Platform**

### DevOps
- **Docker & Docker Compose**
- **GitHub Actions** (CI/CD)
- **PHPUnit** (tests backend)
- **Jest** (tests frontend)

##  Prérequis

- **Docker** et **Docker Compose**
- **Node.js 18+** et **npm**
- **PHP 8.2+** et **Composer**
- **Git**

##  Installation et Démarrage

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/mybank.git
cd mybank
```

### 2. Configuration des environnements

#### Backend (API Symfony)
```bash
cd api
cp .env.example .env
cp .env.example .env.local
```

Modifiez `.env.local` avec vos paramètres :
```env
DATABASE_URL=mysql://root:@127.0.0.1:3306/mybank-api-database
APP_SECRET=your-secret-key
```

#### Frontend (Next.js)
```bash
cd front
cp .env.example .env.local
```

Modifiez `.env.local` :
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8082/api
```

### 3. Démarrage avec Docker

#### Développement
```bash
# Démarrer tous les services
docker-compose up -d

# Installer les dépendances backend
docker-compose exec backend composer install

# Lancer les migrations
docker-compose exec backend php bin/console doctrine:migrations:migrate

# Installer les dépendances frontend
cd front && npm install

# Démarrer le frontend
npm run dev
```

#### Production
```bash
# Copier et configurer l'environnement de production
cp .env.prod.example .env.prod
# Éditer .env.prod avec vos valeurs

# Déployer avec le script automatisé
chmod +x deploy.sh
./deploy.sh prod
```

### 4. Démarrage local (XAMPP)

Si vous préférez utiliser XAMPP pour la base de données :

1. **Démarrer XAMPP** (Apache + MySQL)
2. **Créer la base de données** via phpMyAdmin :
   - Nom : `mybank-api-database`
   - Collation : `utf8mb4_unicode_ci`

3. **Configurer le backend** :
```bash
cd api
# Modifier .env.local
DATABASE_URL=mysql://root:@127.0.0.1:3306/mybank-api-database

# Installer les dépendances
composer install

# Lancer les migrations
php bin/console doctrine:migrations:migrate

# Démarrer le serveur Symfony
symfony server:start --port=8082
```

4. **Démarrer le frontend** :
```bash
cd front
npm install
npm run dev
```

##  CI/CD avec GitHub Actions

Le projet inclut un pipeline CI/CD complet configuré avec GitHub Actions.

### Configuration des Secrets GitHub

Dans votre repository GitHub, ajoutez ces secrets (`Settings > Secrets and variables > Actions`) :

```
DOCKER_USERNAME=votre-username-dockerhub
DOCKER_PASSWORD=votre-token-dockerhub
DEPLOY_HOST=ip-de-votre-serveur (optionnel)
DEPLOY_USER=utilisateur-ssh (optionnel)
DEPLOY_SSH_KEY=cle-ssh-privee (optionnel)
```

### Pipeline CI/CD

Le workflow `.github/workflows/ci-cd.yml` effectue automatiquement :

####  **Intégration Continue (CI)**
1. **Build Backend** : Installation des dépendances Symfony
2. **Build Frontend** : Installation et build Next.js
3. **Tests Backend** : Exécution des tests PHPUnit
4. **Tests Frontend** : Exécution des tests Jest (si disponibles)
5. **Validation API** : Tests d'intégration avec Docker Compose
6. **Tests CRUD** : Validation des endpoints API

####  **Déploiement Continu (CD)**
1. **Build Images Docker** : Construction des images optimisées
2. **Push Docker Hub** : Publication sur Docker Hub
3. **Déploiement** : Déploiement automatique (optionnel)

### Déclenchement du Pipeline

Le pipeline se déclenche automatiquement sur :
- **Push** sur les branches `main` ou `develop`
- **Pull Request** vers `main`
- **Déclenchement manuel** via l'interface GitHub

### Monitoring du Pipeline

```bash
# Voir les logs du workflow
gh run list
gh run view [run-id]

# Voir le statut des services déployés
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

##  Tests

### Backend (PHPUnit)
```bash
# Exécuter tous les tests
cd api
php bin/phpunit

# Tests avec couverture
php bin/phpunit --coverage-html coverage/
```

### Frontend (Jest)
```bash
# Exécuter les tests
cd front
npm test

# Tests en mode watch
npm run test:watch

# Couverture des tests
npm run test:coverage
```

### Tests d'intégration
```bash
# Tests API avec Docker Compose
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
```

##  Déploiement

### Déploiement Automatisé

Utilisez le script de déploiement inclus :

```bash
# Déploiement en développement
./deploy.sh dev

# Déploiement en production
./deploy.sh prod
```

### Déploiement Manuel

#### Production avec Docker
```bash
# Build et démarrage
docker-compose -f docker-compose.prod.yml up -d --build

# Migrations
docker-compose -f docker-compose.prod.yml exec backend php bin/console doctrine:migrations:migrate

# Vérification
curl http://localhost:8082/api/categories
curl http://localhost:3000
```

#### Déploiement sur serveur distant
```bash
# Via SSH (exemple)
scp -r . user@server:/path/to/mybank/
ssh user@server "cd /path/to/mybank && ./deploy.sh prod"
```

##  Configuration Avancée

### Variables d'Environnement

#### Backend (.env.local)
```env
APP_ENV=prod
APP_SECRET=your-super-secret-key
DATABASE_URL=mysql://user:password@host:3306/database
CORS_ALLOW_ORIGIN=https://yourdomain.com
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NODE_ENV=production
```

### Reverse Proxy (Nginx)

Configuration Nginx incluse dans `docker-compose.prod.yml` :

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location /api {
        proxy_pass http://backend:80;
    }
    
    location / {
        proxy_pass http://frontend:3000;
    }
}
```


##  Documentation API

L'API est documentée automatiquement avec API Platform :
- **Documentation** : http://localhost:8082/api/docs
- **Interface interactive** : http://localhost:8082/api

### Endpoints principaux

```
GET    /api/categories          # Liste des catégories
POST   /api/categories          # Créer une catégorie
GET    /api/operations          # Liste des opérations
POST   /api/operations          # Créer une opération
POST   /api/register            # Inscription
POST   /api/login               # Connexion
POST   /api/logout              # Déconnexion
```


**MyBank** 
