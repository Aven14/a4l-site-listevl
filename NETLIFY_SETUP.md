# 🚀 Déploiement sur Netlify (SSR avec API Routes)

Ce guide explique comment déployer le projet sur Netlify en mode **SSR (Server-Side Rendering)** avec les API Routes Next.js.

## ✅ Prérequis

- Un compte Netlify (gratuit sur https://netlify.com)
- Un projet Supabase configuré (voir `SUPABASE_SETUP.md`)
- Git configuré (voir `GIT_SETUP.md`)

## 📋 Configuration

### 1. Installer le plugin Netlify Next.js

Le plugin est déjà configuré dans `netlify.toml`, mais il faut l'installer :

```bash
npm install --save-dev @netlify/plugin-nextjs
```

Ou si tu préfères, Netlify l'installera automatiquement lors du déploiement.

### 2. Vérifier la configuration

Le fichier `netlify.toml` est déjà créé avec :
- Build command : `npm run build`
- Plugin Next.js activé
- Node.js version 18

### 3. Variables d'environnement

Sur Netlify, tu dois configurer ces variables :

1. Va dans ton projet Netlify → **Site settings** → **Environment variables**
2. Ajoute :

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
NEXTAUTH_SECRET = ton-secret-aleatoire-tres-long
NEXTAUTH_URL = https://ton-site.netlify.app
```

**Important** :
- Remplace `[PASSWORD]` par ton mot de passe Supabase
- Remplace `xxxxx` par l'ID de ton projet Supabase
- Remplace `ton-site.netlify.app` par l'URL réelle de ton site Netlify

## 🚀 Déploiement

### Option A : Via Git (Recommandé)

1. **Connecter Netlify à GitHub/GitLab/Bitbucket** :
   - Va sur Netlify → **Add new site** → **Import an existing project**
   - Connecte ton repository Git
   - Netlify détectera automatiquement Next.js

2. **Configurer le build** :
   - Build command : `npm run build` (déjà configuré)
   - Publish directory : `.next` (géré automatiquement par le plugin)
   - Node version : `18` (déjà configuré)

3. **Ajouter les variables d'environnement** (voir étape 3 ci-dessus)

4. **Déployer** :
   - Netlify déploiera automatiquement à chaque push sur `main`/`master`
   - Ou clique sur **Deploy site** pour le premier déploiement

### Option B : Via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Initialiser le projet
netlify init

# Déployer
netlify deploy --prod
```

## 🔧 Vérification

### 1. Vérifier que les Functions sont créées

Après le déploiement, va dans :
- **Site settings** → **Functions**

Tu devrais voir des fonctions serverless créées automatiquement pour tes API routes :
- `/api/auth/[...nextauth]`
- `/api/brands`
- `/api/vehicles`
- etc.

### 2. Tester les API Routes

Teste une route API :
```
https://ton-site.netlify.app/api/brands
```

Tu devrais recevoir du JSON avec les marques.

### 3. Tester l'authentification

- Va sur `https://ton-site.netlify.app/auth/login`
- Essaie de te connecter
- Vérifie que ça fonctionne

## 🐛 Dépannage

### Erreur "Server error" lors de l'accès à la DB

**Cause** : Les variables d'environnement ne sont pas configurées ou incorrectes.

**Solution** :
1. Vérifie que `DATABASE_URL` est correct dans Netlify
2. Vérifie que `NEXTAUTH_SECRET` est défini
3. Vérifie que `NEXTAUTH_URL` correspond à l'URL de ton site Netlify
4. Redéploie après avoir modifié les variables

### Erreur "Functions not found"

**Cause** : Le plugin Next.js n'est pas installé ou activé.

**Solution** :
1. Vérifie que `@netlify/plugin-nextjs` est dans `package.json` (devDependencies)
2. Vérifie que `netlify.toml` contient le plugin
3. Redéploie

### Erreur de build "Prisma Client not generated"

**Cause** : Prisma Client n'est pas généré avant le build.

**Solution** :
- Le script `build` dans `package.json` contient déjà `prisma generate && next build`
- Vérifie que ça fonctionne en local : `npm run build`

### Erreur "Cannot find module '@prisma/client'"

**Cause** : Les dépendances ne sont pas installées correctement.

**Solution** :
1. Vérifie que `@prisma/client` est dans `dependencies` (pas `devDependencies`)
2. Netlify devrait installer automatiquement, mais vérifie les logs de build

### Les API routes retournent 404

**Cause** : Le routing Next.js n'est pas configuré correctement.

**Solution** :
1. Vérifie que tu n'as pas `output: 'export'` dans `next.config.js` (il doit être commenté)
2. Vérifie que le plugin Next.js est activé
3. Redéploie

## 📝 Notes importantes

### Différence avec Static Export

- **Avant (Static Export)** : Site 100% statique, pas de serveur, Prisma ne peut pas fonctionner
- **Maintenant (SSR)** : Next.js tourne sur Netlify Functions, Prisma fonctionne côté serveur

### Performance

- Les API routes sont des **Netlify Functions** (serverless)
- Chaque route API = une fonction serverless
- Cold start possible (première requête peut être lente)
- Les requêtes suivantes sont rapides

### Limitations Netlify (Plan Gratuit)

- **100 GB de bande passante** par mois
- **300 minutes de build** par mois
- **125 000 invocations de fonctions** par mois
- Parfait pour un projet de taille moyenne

### Migration depuis Static Export

Si tu avais déjà déployé en mode statique :
1. Retire `output: 'export'` de `next.config.js` (déjà fait ✅)
2. Ajoute les variables d'environnement sur Netlify
3. Redéploie
4. Les API routes fonctionneront maintenant !

## 🔄 Mise à jour

Pour mettre à jour le site :
1. Fais tes modifications en local
2. Teste avec `npm run dev`
3. Commit et push sur Git
4. Netlify déploiera automatiquement

Ou manuellement :
```bash
netlify deploy --prod
```

## ✅ Checklist de déploiement

- [ ] Plugin `@netlify/plugin-nextjs` installé
- [ ] `netlify.toml` configuré
- [ ] `next.config.js` n'a PAS `output: 'export'` (commenté ✅)
- [ ] Variables d'environnement configurées sur Netlify
- [ ] `DATABASE_URL` correct (Supabase)
- [ ] `NEXTAUTH_SECRET` défini
- [ ] `NEXTAUTH_URL` = URL Netlify
- [ ] Build réussi
- [ ] Functions visibles dans Netlify
- [ ] API routes testées
- [ ] Authentification fonctionne

## 🆘 Support

Si tu as des problèmes :
1. Vérifie les **Deploy logs** sur Netlify
2. Vérifie les **Function logs** pour les erreurs API
3. Teste en local avec `npm run dev`
4. Vérifie que Supabase est accessible
