# 🚀 Déploiement sur hébergeur PHP

Ce guide explique comment déployer le site Next.js sur un hébergeur PHP classique.

## ⚠️ Limitations

**Important** : Un export statique Next.js ne supporte **PAS** :
- Les API Routes (`/api/*`)
- L'authentification NextAuth (nécessite un serveur Node.js)
- Les Server Components avec base de données
- Les fonctionnalités serveur

Pour un site avec authentification et base de données, utilisez **Vercel** ou un hébergeur Node.js.

## 📦 Étapes de déploiement

### 1. Préparer l'export statique

Modifiez `next.config.js` pour activer l'export statique :

```js
const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'export', // Ajoutez cette ligne
}
```

### 2. Build et export

```bash
npm run build
```

Cela créera un dossier `out/` avec tous les fichiers statiques.

### 3. Uploader les fichiers

Uploader sur votre hébergeur PHP :
- Le dossier `out/` (renommez-le en `out` ou gardez-le tel quel)
- Le fichier `index.php` (à la racine)

**Structure sur l'hébergeur :**
```
/
├── index.php
└── out/
    ├── index.html
    ├── _next/
    └── ...
```

### 4. Configuration de l'hébergeur

Assurez-vous que :
- PHP est activé
- Le fichier `index.php` est bien à la racine
- Les permissions sont correctes (755 pour les dossiers, 644 pour les fichiers)

## 🔧 Alternative : Utiliser un sous-dossier

Si vous voulez mettre le site dans un sous-dossier (ex: `/site/`) :

1. Modifiez `index.php` ligne 8 :
```php
$outDir = __DIR__ . '/out';
```
En :
```php
$outDir = __DIR__ . '/site/out';
```

2. Ou déplacez le dossier `out/` dans `site/out/`

## 📝 Notes

- Le fichier `index.php` est dans `.gitignore` et ne sera **pas** versionné
- Pour les fonctionnalités complètes (auth, API), utilisez Vercel ou un hébergeur Node.js
- L'export statique fonctionne uniquement pour les pages publiques sans logique serveur
