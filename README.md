# 🚗 Arma For Life - Concession Automobile

Site de concession automobile pour le serveur Arma 3 RP **Arma For Life**.

## 🛠️ Stack Technique

- **Frontend/Backend**: Next.js 14 (App Router)
- **Base de données**: Supabase (PostgreSQL) avec Prisma ORM
- **Authentification**: NextAuth.js
- **Styling**: Tailwind CSS

## 📦 Installation

```bash
# 1. Cloner le repository
git clone <url-du-repo>
cd arma-for-life-concession

# 2. Installer les dépendances
npm install

# 3. Configurer Supabase
# Voir SUPABASE_SETUP.md pour les instructions détaillées
# Créer un projet sur https://supabase.com
# Récupérer la connection string

# 4. Créer le fichier .env
# Ajouter :
# DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
# NEXTAUTH_SECRET="votre-secret-aleatoire"
# NEXTAUTH_URL="http://localhost:3000"

# 5. Initialiser la base de données
npx prisma generate
npx prisma db push

# 6. Ajouter les données d'exemple
npm run db:seed

# 7. Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur http://localhost:3000

## 👤 Comptes par défaut

- **Superadmin**: `superadmin` / `superadmin123`
- **Admin**: `admin` / `admin123`

## 📁 Structure du Projet

```
├── prisma/
│   ├── schema.prisma      # Schéma de la base de données
│   ├── seed.js            # Données d'exemple
│   └── data/              # Données JSON
├── src/
│   ├── app/
│   │   ├── api/           # Routes API REST
│   │   │   ├── auth/      # Authentification
│   │   │   ├── brands/    # CRUD Marques
│   │   │   ├── vehicles/  # CRUD Véhicules
│   │   │   └── admin/     # Routes admin
│   │   ├── admin/         # Panel administration
│   │   ├── auth/          # Pages de connexion/inscription
│   │   ├── account/       # Gestion du compte
│   │   ├── brands/        # Pages publiques marques
│   │   └── vehicles/      # Pages publiques véhicules
│   ├── components/        # Composants React
│   └── lib/               # Utilitaires (Prisma, Auth)
```

## 🗄️ Schéma Base de Données

### Roles (Rôles)
- Rôles système : superadmin, admin, user
- Rôles personnalisables avec permissions granulaires

### Users (Utilisateurs)
- Authentification par credentials
- Assignation de rôles
- Gestion de profil

### Brands (Marques)
- Nom, logo optionnel
- Relation avec véhicules

### Vehicles (Véhicules)
- Nom, description, prix
- Caractéristiques : puissance, vmax, sièges, coffre
- Catégorie (sport, supercar, moto, etc.)
- Images (JSON array)

## 🔌 Endpoints API

### Marques
- `GET /api/brands` - Liste des marques
- `POST /api/brands` - Créer (admin)
- `GET /api/brands/:id` - Détail
- `PUT /api/brands/:id` - Modifier (admin)
- `DELETE /api/brands/:id` - Supprimer (admin)

### Véhicules
- `GET /api/vehicles` - Liste des véhicules
- `GET /api/vehicles?brandId=xxx` - Filtrer par marque
- `POST /api/vehicles` - Créer (admin)
- `GET /api/vehicles/:id` - Détail
- `PUT /api/vehicles/:id` - Modifier (admin)
- `DELETE /api/vehicles/:id` - Supprimer (admin)

### Admin
- `GET /api/admin/users` - Liste utilisateurs (superadmin)
- `PUT /api/admin/users/:id` - Modifier rôle (superadmin)
- `GET /api/admin/roles` - Liste rôles (superadmin)
- `POST /api/admin/roles` - Créer rôle (superadmin)
- `PUT /api/admin/roles/:id` - Modifier rôle (superadmin)
- `POST /api/admin/reset` - Reset DB (admin)

### Account
- `PUT /api/account` - Modifier profil
- `PUT /api/account/password` - Changer mot de passe
- `DELETE /api/account` - Supprimer compte

## 🎨 Fonctionnalités

### Site Public
- ✅ Page d'accueil
- ✅ Liste des marques avec recherche
- ✅ Page marque avec ses véhicules
- ✅ Page véhicule avec caractéristiques et assurances
- ✅ Affichage du lieu d'achat selon la marque

### Panel Admin
- ✅ Authentification sécurisée
- ✅ Dashboard avec statistiques
- ✅ CRUD complet marques (avec recherche)
- ✅ CRUD complet véhicules (classés par marque, recherche)
- ✅ Gestion des utilisateurs et rôles
- ✅ Création de rôles personnalisés
- ✅ Import JSON de véhicules
- ✅ Reset de la base de données

### Gestion de compte
- ✅ Modification pseudo/email
- ✅ Changement de mot de passe
- ✅ Suppression de compte

### Design
- ✅ Dark theme militaire/RP
- ✅ Responsive (mobile + desktop)
- ✅ Animations fluides

## 🚀 Déploiement sur GitHub

```bash
# 1. Initialiser Git (si pas déjà fait)
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Faire le premier commit
git commit -m "Initial commit - Arma For Life Concession"

# 4. Créer un repository sur GitHub
# Aller sur https://github.com/new
# Créer un nouveau repo (ne pas initialiser avec README)

# 5. Lier le repo local au repo GitHub
git remote add origin https://github.com/TON-USERNAME/TON-REPO.git

# 6. Pousser le code
git branch -M main
git push -u origin main
```

## 📝 Variables d'environnement

Voir `.env.example` pour la liste complète des variables nécessaires.

## 📝 License

Projet créé pour Arma For Life - Serveur Arma 3 RP
