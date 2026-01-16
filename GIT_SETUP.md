# 📤 Instructions pour uploader sur GitHub

## 1. Installer Git

Téléchargez Git depuis : https://git-scm.com/download/win

Installez-le avec les options par défaut.

## 2. Ouvrir Git Bash ou PowerShell

Après l'installation, ouvrez **Git Bash** ou **PowerShell** dans le dossier du projet.

## 3. Initialiser Git

```bash
# Aller dans le dossier du projet
cd "E:\Pour A4L\Site internet"

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit - Arma For Life Concession"
```

## 4. Créer un repository sur GitHub

1. Allez sur https://github.com
2. Connectez-vous (ou créez un compte)
3. Cliquez sur le **+** en haut à droite → **New repository**
4. Donnez un nom (ex: `arma-for-life-concession`)
5. **Ne cochez PAS** "Initialize this repository with a README"
6. Cliquez sur **Create repository**

## 5. Lier et pousser le code

```bash
# Remplacer USERNAME et REPO-NAME par vos valeurs
git remote add origin https://github.com/USERNAME/REPO-NAME.git

# Renommer la branche en main
git branch -M main

# Pousser le code
git push -u origin main
```

## 6. Pour les prochaines modifications

```bash
# Ajouter les fichiers modifiés
git add .

# Faire un commit
git commit -m "Description de vos modifications"

# Pousser sur GitHub
git push
```

## ⚠️ Important

Le fichier `.env` est déjà dans `.gitignore` donc il ne sera **pas** uploadé sur GitHub (c'est normal, il contient des secrets).

Si vous voulez que d'autres personnes puissent utiliser le projet, créez un fichier `.env.example` avec :

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```
