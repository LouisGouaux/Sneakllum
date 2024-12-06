# Sneakllum

Site E-commerce de vente de sneakers.\
Site en ligne : https://sneakllum.vercel.app

## 🚀 Fonctionnalités

- **React 19.0.0** et **Next.js 15.0.3**
- Support de **TypeScript**
- Authentification
- Affichage de la liste des produits
- Recherche d'un produit
- Filtres des produits par catégorie, taille, couleur et nouveauté
- Ajout de produits dans le panier
- Passer commande
- CRUD administrateur (email : admin@admin.com ; mot de passe : superadmin)
- Génération du numéro de la commande
- Historique des commandes

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (version 21.6.1 ou supérieure)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

## ⚙️ Installation

1. Clonez le dépôt GitHub :
   ```bash
   git clone https://github.com/LouisGouaux/Sneakllum.git
   cd sneakllum
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```
   ou, si vous utilisez Yarn :
   ```bash
   yarn install
   ```

## ▶️ Démarrage du projet

Pour lancer le projet en mode développement, exécutez la commande suivante :

```bash
npm run dev
```
ou, avec Yarn :
```bash
yarn dev
```

Le serveur de développement sera accessible à l'adresse : [http://localhost:3000](http://localhost:3000).

## 🛠️ Scripts disponibles

- **`npm run dev`** : Lance le serveur de développement.
- **`npm run build`** : Compile l'application pour la production.
- **`npm start`** : Démarre le serveur Next.js en mode production.
- **`npm run lint`** : Vérifie le code avec ESLint.

## 📁 Structure du projet

Voici un aperçu de l'organisation des fichiers dans ce projet :

```
MonProjet/
├── public/            # Assets publics (images, favicons, etc.)
├── src/
│   ├── pages/         # Pages Next.js
│   ├── components/    # Composants réutilisables
│   ├── styles/        # Fichiers CSS/SCSS
│   └── utils/         # Fonctions utilitaires
├── .eslintrc.json     # Configuration ESLint
├── next.config.js     # Configuration Next.js
├── package.json       # Informations sur le projet et scripts
└── README.md          # Ce fichier
```

## 📝 Développeurs

Ivan Robin, Louis Gouaux et Alexandre Quintela

---
**🎉 Merci d'avoir utilisé ce projet !**
