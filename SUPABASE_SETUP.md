# 🗄️ Configuration Supabase

Ce guide explique comment configurer Supabase pour le projet.

## 📋 Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur https://supabase.com
2. Créez un compte (gratuit)
3. Cliquez sur **New Project**
4. Remplissez les informations :
   - **Name** : `arma-for-life-concession` (ou autre)
   - **Database Password** : Choisissez un mot de passe fort (⚠️ **SAVEZ-LE**)
   - **Region** : Choisissez la région la plus proche
5. Cliquez sur **Create new project**

### 2. Récupérer la connection string

1. Dans votre projet Supabase, allez dans **Settings** → **Database**
2. Scrollez jusqu'à **Connection string**
3. Sélectionnez **URI** (pas "Session mode")
4. Copiez la connection string (elle ressemble à ça) :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

### 3. Configurer les variables d'environnement

Créez/modifiez votre fichier `.env` :

```env
# Supabase Database URL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# NextAuth
NEXTAUTH_SECRET="votre-secret-super-long-et-aleatoire-ici"
NEXTAUTH_URL="http://localhost:3000"
```

**Important** :
- Remplacez `[YOUR-PASSWORD]` par le mot de passe que vous avez créé
- Remplacez `xxxxx` par l'ID de votre projet Supabase
- Pour `NEXTAUTH_SECRET`, générez une clé aléatoire avec :
  ```bash
  openssl rand -base64 32
  ```
  Ou utilisez : https://generate-secret.vercel.app/32

### 4. Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers Supabase
npx prisma db push

# Ajouter les données d'exemple
npm run db:seed
```

### 5. Vérifier la connexion

```bash
# Ouvrir Prisma Studio pour voir les données
npm run db:studio
```

## 🚀 Pour Vercel

Quand vous déployez sur Vercel :

1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez :
   - `DATABASE_URL` : Votre connection string Supabase
   - `NEXTAUTH_SECRET` : Votre secret
   - `NEXTAUTH_URL` : `https://votre-site.vercel.app`

**⚠️ Important** : Utilisez la connection string avec `pgbouncer=true` pour Vercel (meilleure performance).

## 🔒 Sécurité

- **Ne commitez JAMAIS** votre `.env` (déjà dans `.gitignore` ✅)
- Utilisez des mots de passe forts
- Activez **Row Level Security (RLS)** dans Supabase si nécessaire
- Utilisez des **connection pooling** pour la production

## 📊 Gérer la base de données

### Via Supabase Dashboard
- Allez dans **Table Editor** pour voir/modifier les données
- Utilisez **SQL Editor** pour exécuter des requêtes SQL

### Via Prisma Studio
```bash
npm run db:studio
```

### Via Prisma CLI
```bash
# Voir le schéma
npx prisma studio

# Faire des migrations
npx prisma migrate dev

# Réinitialiser (⚠️ supprime toutes les données)
npx prisma migrate reset
```

## 🆘 Dépannage

### Erreur de connexion
- Vérifiez que votre IP est autorisée dans Supabase (Settings → Database → Connection pooling)
- Vérifiez que le mot de passe est correct dans `DATABASE_URL`
- Vérifiez que le projet Supabase est actif

### Erreur "relation does not exist"
- Exécutez `npx prisma db push` pour créer les tables
- Vérifiez que le schéma Prisma est correct

### Performance lente
- Utilisez la connection string avec `pgbouncer=true`
- Activez le connection pooling dans Supabase

## 📝 Notes

- Supabase offre **500 MB de stockage** gratuit
- **2 GB de bande passante** par mois (gratuit)
- Parfait pour les projets de taille moyenne
- Supporte les migrations Prisma
- Interface web pour gérer les données
