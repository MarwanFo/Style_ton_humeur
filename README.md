# 🌟 Style ton Humeur (Humeur & Look)

![Application Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React_Native-Expo-black?logo=react)
![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?logo=postgresql)

**Style ton Humeur** est une application mobile intelligente et dynamique qui aide les utilisateurs à obtenir des recommandations personnalisées (tenues, maquillage, et musique) en fonction de leur état émotionnel actuel et de leur contexte quotidien, en s'appuyant sur l'Intelligence Artificielle.

---

## 👥 Membres de l'Équipe
* **BENTALEB Chaymae**
* **FARIDI Marwane**
* **KAF Abdessamad**

---

## ✨ Fonctionnalités Principales (MVP)

### 1. 🔐 Authentification & Profil Utilisateur (Conformité RGPD)
* Inscription et connexion sécurisée (JWT + Bcrypt).
* Profil enrichi avec âge et genre pour personnaliser les résultats de l'IA.
* Suppression définitive de compte respectant la législation sur la protection des données.

### 2. 🤖 Module IA de Détection d'Humeur
* Un questionnaire immersif et interactif à 4 étapes (Énergie, Envie, Contexte, Style).
* Analyse en arrière-plan propulsée par **Google Gemini AI** générant un Mood global.
* Modélisation de suggestions ultra-précises en une fraction de seconde avec fallback (mode hors-ligne sécurisé).

### 3. 👗 Recommandations Sur-Mesure
* Affichage de **3 looks de tenues** sous forme de cartes élégantes en Glassmorphism.
* Proposition de **2 routines makeup** (naturel & intense).
* Intégration musicale pour sublimer l'état d'esprit de la journée.
* Feedback utilisateur interactif (favoris, système de Top/Flop).

### 4. 🔥 Gamification (Streak & Badges)
* **Système de Streak (Série active)** pour encourager l'usage quotidien.
* **Streak Freeze** : Mécanisme qui protège la série en cas d'absence d'une journée par semaine.
* Collection de **Badges de succès** débloqués automatiquement à certains paliers (ex: "Premier Pas", "Sérieux", "Styliste").

### 5. 🔔 Notifications Intelligentes
* Rappels locaux automatiques (Push Notifications) programmés à 20h00 pour éviter de perdre le streak.
* Alertes instantanées de déblocage de nouveaux succès et badges.
* Toggle interactif d'activation depuis les paramètres du profil.

---

## 🛠️ Stack Technique

### Mobile (Frontend)
* **Framework** : React Native avec Expo (SDK 54)
* **Routage** : Expo Router (Navigation par système de fichiers)
* **UI & Animations** : Vanilla StyleSheet, React Native Reanimated, Expo Blur (Glassmorphism), Linear Gradients
* **Stockage local** : AsyncStorage (Tokens, préférences de notification)

### Backend & API
* **Architecture** : NestJS (Node.js) en architecture modulaire (Controllers, Services)
* **Base de données** : PostgreSQL
* **ORM** : Prisma (Typage strict et migrations fluides)
* **Sécurité** : Passport JWT, Guards globaux

### Services Externes
* **IA** : API Gemini 2.5 Flash
* **Météo** : Open-Meteo API (pour la contextualisation géographique future)

---

## 🚀 Guide d'Installation et Lancement

### 1. Cloner le Projet
```bash
git clone https://github.com/MarwanFo/Style_ton_humeur.git
cd Style_ton_humeur
```

### 2. Configuration Backend
```bash
cd backend
npm install
```
* Dans le dossier `backend`, créez un fichier `.env` contenant vos variables d'environnement (y compris `DATABASE_URL` pointant vers votre serveur PostgreSQL et `GEMINI_API_KEY`).
* Synchronisez la base de données :
```bash
npx prisma db push
```
* Lancez le serveur de développement :
```bash
npm run start:dev
```

### 3. Configuration Frontend
Ouvrez un nouveau terminal.
```bash
cd frontend
npm install
```
* Assurez-vous d'être connecté au même réseau Wi-Fi que le backend. L'application résoudra dynamiquement votre adresse IP via `constants/Api.ts`.
* Lancez Expo :
```bash
npx expo start -c
```
* Scannez le QR Code avec l'application **Expo Go** (Android/iOS) ou appuyez sur `a` / `i` pour utiliser un émulateur.

---

## 🎓 Projet de Fin d'Études / Examen
Ce projet a été développé dans le respect strict du cahier des charges initial. Il intègre une architecture propre, des interfaces premium interactives, et une logique métier avancée démontrant des compétences full-stack modernes.
