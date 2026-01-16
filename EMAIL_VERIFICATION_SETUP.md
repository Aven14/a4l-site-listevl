# 📧 Configuration de la Vérification par E-mail

Ce guide explique comment configurer le système de vérification par e-mail pour le projet.

## 🎯 Fonctionnalités

- ✅ Inscription avec génération automatique d'un code à 6 chiffres
- ✅ Envoi d'e-mail avec Nodemailer (SMTP configurable)
- ✅ Code valide pendant 10 minutes
- ✅ Limite de 5 tentatives de vérification
- ✅ Renvoi de code possible
- ✅ Sécurité : code supprimé après utilisation
- ✅ Protection : les comptes non vérifiés ne peuvent pas se connecter

## 📋 Configuration SMTP

### Option 1 : Gmail (Recommandé pour le développement)

1. **Activer l'authentification à deux facteurs** sur ton compte Gmail
2. **Générer un mot de passe d'application** :
   - Va sur https://myaccount.google.com/apppasswords
   - Sélectionne "Mail" et "Autre (nom personnalisé)"
   - Entrez "Arma For Life"
   - Copie le mot de passe généré (16 caractères)

3. **Ajouter dans `.env`** :
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ton-email@gmail.com
SMTP_PASS=ton-mot-de-passe-application
```

### Option 2 : Outlook / Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ton-email@outlook.com
SMTP_PASS=ton-mot-de-passe
```

### Option 3 : Mailtrap (Pour les tests)

1. Crée un compte sur https://mailtrap.io (gratuit)
2. Va dans "Inboxes" → "SMTP Settings"
3. Sélectionne "Node.js - Nodemailer"
4. Copie les identifiants

```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=ton-username-mailtrap
SMTP_PASS=ton-password-mailtrap
```

### Option 4 : Autres services SMTP

**SendGrid** :
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=ton-api-key-sendgrid
```

**Mailgun** :
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ton-username-mailgun
SMTP_PASS=ton-password-mailgun
```

## 🔧 Variables d'environnement

Ajoute ces variables dans ton fichier `.env` :

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ton-email@example.com
SMTP_PASS=ton-mot-de-passe

# NextAuth (déjà existant)
NEXTAUTH_SECRET=ton-secret
NEXTAUTH_URL=http://localhost:3000

# Database (déjà existant)
DATABASE_URL=postgresql://...
```

## 🚀 Utilisation

### 1. Inscription

1. L'utilisateur s'inscrit sur `/auth/register`
2. Un code à 6 chiffres est généré et envoyé par e-mail
3. L'utilisateur est redirigé vers `/auth/verify?email=...`

### 2. Vérification

1. L'utilisateur entre le code reçu par e-mail
2. Le code est vérifié (valide 10 minutes, max 5 tentatives)
3. Si correct, le compte est activé et l'utilisateur peut se connecter

### 3. Renvoi de code

- L'utilisateur peut demander un nouveau code
- Les tentatives sont réinitialisées
- Un nouveau code est généré et envoyé

## 🔒 Sécurité

### Mesures implémentées

- ✅ **Code à 6 chiffres aléatoire** : difficile à deviner
- ✅ **Expiration après 10 minutes** : limite la fenêtre d'attaque
- ✅ **Limite de 5 tentatives** : protection contre les attaques par force brute
- ✅ **Code supprimé après utilisation** : ne peut être utilisé qu'une fois
- ✅ **Mot de passe hashé avec bcrypt** : sécurité standard
- ✅ **Comptes non vérifiés bloqués** : ne peuvent pas se connecter

### Bonnes pratiques

1. **Change les mots de passe par défaut** en production
2. **Utilise un service SMTP professionnel** (SendGrid, Mailgun) en production
3. **Active HTTPS** pour protéger les données en transit
4. **Surveille les tentatives échouées** pour détecter les attaques
5. **Limite le taux d'envoi d'e-mails** pour éviter le spam

## 🐛 Dépannage

### L'e-mail n'est pas envoyé

1. **Vérifie les variables SMTP** dans `.env`
2. **Teste la connexion SMTP** :
   ```bash
   node -e "const nodemailer = require('nodemailer'); const transporter = nodemailer.createTransport({host: process.env.SMTP_HOST, port: process.env.SMTP_PORT, auth: {user: process.env.SMTP_USER, pass: process.env.SMTP_PASS}}); transporter.verify().then(() => console.log('✅ SMTP OK')).catch(e => console.error('❌', e));"
   ```

3. **Vérifie les logs** du serveur pour les erreurs
4. **Pour Gmail** : assure-toi d'utiliser un mot de passe d'application, pas ton mot de passe normal

### Le code n'arrive pas

1. **Vérifie les spams** / courrier indésirable
2. **Vérifie que l'e-mail est correct** dans la base de données
3. **Teste avec Mailtrap** pour voir si l'e-mail est bien envoyé

### "Code invalide ou expiré"

1. **Vérifie que le code n'est pas expiré** (10 minutes)
2. **Vérifie le nombre de tentatives** (max 5)
3. **Demande un nouveau code** si nécessaire

### "Nombre maximum de tentatives atteint"

1. **Demande un nouveau code** : cela réinitialise les tentatives
2. **Vérifie que le compte n'est pas déjà vérifié**

## 📝 Routes API

### `POST /api/auth/register`
Inscription d'un nouvel utilisateur
- Génère un code de vérification
- Envoie un e-mail
- Crée le compte avec `isVerified: false`

### `POST /api/auth/verify-code`
Vérifie le code de vérification
- Vérifie le code et l'expiration
- Limite les tentatives
- Active le compte si correct

### `POST /api/auth/resend-code`
Renvoie un nouveau code
- Génère un nouveau code
- Réinitialise les tentatives
- Envoie un nouvel e-mail

## 🎨 Personnalisation

### Modifier le template d'e-mail

Édite `src/lib/email.ts` pour personnaliser :
- Le design de l'e-mail
- Le message
- La durée de validité du code (actuellement 10 minutes)

### Modifier la durée de validité

Dans `src/app/api/auth/register/route.ts` :
```typescript
const codeExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
```

### Modifier le nombre de tentatives

Dans `src/app/api/auth/verify-code/route.ts` :
```typescript
const MAX_ATTEMPTS = 5
```

## ✅ Checklist de déploiement

- [ ] Variables SMTP configurées dans `.env`
- [ ] Test d'envoi d'e-mail réussi
- [ ] Variables d'environnement configurées sur Netlify/Vercel
- [ ] Base de données migrée (`npx prisma db push`)
- [ ] Test d'inscription complet
- [ ] Test de vérification de code
- [ ] Test de renvoi de code
- [ ] Vérification que les comptes non vérifiés ne peuvent pas se connecter

## 📚 Ressources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Mailtrap (Tests)](https://mailtrap.io/)
