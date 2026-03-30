# Flowlance Frontend

## Présentation

Ce dépôt contient le frontend de l'application Flowlance, développé avec React 19, Vite et Tailwind CSS 4.
C'est une application monopage (SPA) avec routage client, formulaires d'authentification et tableau de bord.
Flowlance est une application web de mise en relation entre freelances et entreprises. En intégrant l'Intelligence Artificielle, la plateforme automatise le matching des compétences, aide à la rédaction d'offres d'emploi et propose un coaching CV personnalisé.

**Lien vers l'API Backend (Django) :** https://github.com/Yethiii/flowlance-backend.git
**Lien vers la version en ligne (Frontend) :** https://flowlance-frontend.vercel.app

## Stack technique

- React 19
- Vite 4/8
- Tailwind CSS 4
- Flowbite React
- React Router DOM 7
- ESLint

## Structure principale

- `src/main.jsx` : point d'entrée de l'application
- `src/App.jsx` : définition des routes de l'application
- `src/index.css` : styles globaux
- `src/components/` : composants UI et pages du frontend
- `package.json` : dépendances et scripts
- `vite.config.js` : configuration Vite avec plugins React et Tailwind

## Installation

1. Ouvrir un terminal dans le dossier du projet et clôner le dépôt.
2. Installer les dépendances :

```bash
npm install
```

### Configurer les variables d'environnement

Pour que l'interface puisse communiquer avec l'API, vous devez lui indiquer l'adresse du serveur Backend. 

À la racine du dossier `flowlance_frontend`, créez un nouveau fichier nommé exactement `.env` et collez-y cette ligne :
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## Exécution en développement

```bash
npm run dev
```

Puis ouvrir l'URL indiquée par Vite, généralement `http://localhost:5173`.

## Build de production

```bash
npm run build
```

## Route principale

Le routage est défini dans `src/App.jsx` :

- `/login` → page de connexion
- `/register` → page d'inscription
- `/dashboard` → tableau de bord
- `*` → redirection vers `/login`

## Composants clés

- `src/components/login.jsx`
- `src/components/register.jsx`
- `src/components/dashboard.jsx`
- `src/components/dashboardCompany.jsx`
- `src/components/dashboardFreelance.jsx`
- `src/components/FreelanceJobBoard.jsx`
- `src/components/CompanyJobOffers.jsx`
- `src/components/CompanyApplications.jsx`
- `src/components/FreelanceProfileForm.jsx`
- `src/components/CompanyProfileForm.jsx`
- `src/components/FreelanceSkillsForm.jsx`
- `src/components/DirectChatModal.jsx`
- `src/components/FreelanceChatModal.jsx`
- `src/components/FreelanceCVCoach.jsx`
- `src/components/FreelanceProfileModal.jsx`
- `src/components/MessageModal.jsx`
- `src/components/MentionsLegales.jsx`

## Configuration Vite

Le projet utilise les plugins suivants dans `vite.config.js` :

- `@vitejs/plugin-react`
- `@tailwindcss/vite`

## Dépendances principales

- `react`
- `react-dom`
- `react-router-dom`
- `react-icons`
- `tailwindcss`
- `flowbite-react`

## Dépendances de développement

- `vite`
- `@vitejs/plugin-react`
- `eslint`
- `@eslint/js`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `@types/react`
- `@types/react-dom`
- `globals`

## Bonnes pratiques

- Utiliser `npm run dev` pour le développement local
- Commiter des modifications pertinentes par fonctionnalité
- Garder `src/components/` organisé par type de page ou domaine fonctionnel
- Ajouter des tests et typage si le projet évolue vers TypeScript

## À adapter selon le projet

- Intégrer un module d'API sécurisé si des appels backend sont nécessaires
- Ajouter des tests unitaires / E2E pour la stabilité

## Licence

Ce projet est actuellement privé.

## Auteur

**Laetitia Voué** - Projet d'intégration réalisé dans le cadre du BAC3 Informatique.
