# 🌟 Style ton Humeur (Pocket Stylist & Fitting Room AI)

> **Plateforme intelligente d'aide au choix et de recommandation de tenues, routines maquillage, et playlists musicales adaptées au mood et à la météo journalière.**

Ce projet est développé avec passion dans le cadre de l'Examen Mobile Académique par :
* **BENTALEB Chaymae** (Directrice Frontend & UI/UX)
* **FARIDI Marwane** (Directeur Backend, Données & Métier)
* **KAF Abdessamad** (Directeur IA & Intégrations)

---

![Application Version](https://img.shields.io/badge/version-1.1.0-brightgreen.svg)
![React Native](https://img.shields.io/badge/React_Native-Expo_54-black?logo=react)
![NestJS](https://img.shields.io/badge/Backend-NestJS_11-E0234E?logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_/_MySQL-316192?logo=postgresql)
![AI-Powered](https://img.shields.io/badge/AI-Gemini_2.5_Flash-orange?logo=google-gemini)

**Style ton Humeur** est une application mobile intelligente, immersive et dynamique qui aide les utilisateurs à obtenir des recommandations personnalisées (tenues, maquillage, et musique) en fonction de leur humeur et de leur contexte quotidien, en combinant la puissance de l'Intelligence Artificielle générative, de l'audio et de la vision par ordinateur.

---

## ✨ Fonctionnalités Principales (Premium Edition)

### 1. 🤖 Module IA de Détection d'Humeur & Sentiments
* **Questionnaire Interactif (Aura Quiz)** : Parcours fluide à 4 étapes (Énergie, Envie, Contexte de la journée, Style artistique).
* **Assistant Vocal Styliste (Pocket Stylist IA)** : Parlez librement à l'application. Votre voix est enregistrée, transcrite et analysée par **Google Gemini 2.5 Flash** pour détecter instantanément votre humeur et composer vos looks.
* **Scan Facial / Vocal de Sentiments** : Suivez votre humeur quotidienne grâce au scan photo de selfie ou de voix. Analyse complète des sentiments avec historiques et graphes de comparaison.

### 2. 🗣️ Synthèse Vocale Premium (Neural TTS)
* Vos recommandations de style s'accompagnent d'une **note vocale personnalisée de votre styliste**.
* Intégration de **Microsoft Edge Neural Voices** (`msedge-tts`) pour générer et diffuser une lecture audio ultra-réaliste, naturelle et chaleureuse du rapport de style.

### 3. 👗 Essayage Virtuel & Cabine d'Ajustement (Fitting Room)
* Visualisation de **3 tenues stylisées** (Glassmorphism design).
* **Cabine d'Essayage Virtuelle (VTON)** : Importez ou prenez une photo de votre silhouette. L'algorithme projette la tenue recommandée directly sur votre corps avec l'IA.
* Sauvegarde persistante de vos combinaisons de cabine d'essayage préférées et de vos photos personnalisées.

### 4. 📈 Gamification & Rétention
* **Système de Streak (Série active)** de check-in journalier.
* **Streak Freeze** : Protection de la série active en cas d'absence (un freeze par semaine).
* **Galerie de Badges** : Récompenses débloquées automatiquement (ex: *Premier Pas*, *Styliste Confirmé*, *Aura Légendaire*).

### 5. 🔔 Notifications Push & Rappels
* Rappels automatiques planifiés localement chaque soir à 20h00 pour éviter de briser la série active.
* Option d'activation/désactivation directe depuis l'écran des paramètres du profil.

---

## 🛠️ Stack Technique & Services

### Mobile (Frontend)
* **Framework** : React Native avec Expo (SDK 54) & TypeScript.
* **Routage** : Expo Router v3 (navigation typée par fichiers).
* **UI & Audio/Vidéo** : Vanilla StyleSheets, `react-native-reanimated` pour des transitions fluides, `expo-av` pour le traitement audio (enregistrement et lecture TTS), `expo-image-picker` pour l'ajustement cabine.

### Backend & API
* **Base de données** : PostgreSQL ou MySQL (via Prisma ORM).
* **Framework** : NestJS (Node.js) organisé en modules découplés (`Users`, `Auth`, `Checkins`, `Weather`, `Ai`, `Music`, `Badges`).
* **Sécurité & Auth** : Passport JWT, Guards d'authentification pour protéger les endpoints utilisateurs.

### Services Cloud & IA
* **Modèle Text/Voice** : Google Gemini 2.5 Flash pour la transcription et l'analyse de sentiment.
* **Neural Text-to-Speech** : API Microsoft Edge Read-Aloud (`msedge-tts`).
* **Stockage Médias** : **Cloudinary** pour le stockage sécurisé des photos de silhouettes et des fichiers de notes vocales.
* **Virtual Try-On** : API Replicate (modèle IDM-VTON) pour l'essayage virtuel de vêtements.

---

## 🚀 Guide d'Installation et de Lancement

### 1. Cloner le Projet
```bash
git clone https://github.com/MarwanFo/Style_ton_humeur.git
cd Style_ton_humeur
```

### 2. Lancer le Backend (NestJS)
1. Allez dans le dossier `backend` :
   ```bash
   cd backend
   npm install
   ```

2. Créez un fichier `.env` à la racine de `/backend` (s'il n'existe pas) :
   ```env
   # Database (PostgreSQL ou MySQL)
   DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/style_ton_humeur?schema=public"

   # AI & APIs
   GEMINI_API_KEY="VOTRE_CLE_GEMINI"
   REPLICATE_API_TOKEN="VOTRE_TOKEN_REPLICATE"

   # Cloudinary
   CLOUDINARY_CLOUD_NAME="votre_cloud_name"
   CLOUDINARY_API_KEY="votre_api_key"
   CLOUDINARY_API_SECRET="votre_api_secret"

   # Auth
   JWT_SECRET="un_secret_tres_robuste"
   ```

3. Exécutez les migrations Prisma pour créer la base et les tables :
   ```bash
   npx prisma migrate dev --name init
   ```

4. Lancez le serveur de développement :
   ```bash
   npm run start:dev
   ```
   L'API sera disponible sur : `http://localhost:3000/api`

### 3. Lancer le Frontend (React Native - Expo)
1. Allez dans le dossier `frontend` :
   ```bash
   cd ../frontend
   npm install
   ```
2. Lancez le serveur Expo :
   ```bash
   npx expo start
   ```
3. Scannez le QR Code avec l'application mobile **Expo Go** (sur iOS/Android) pour lancer l'application !

---

## 🎓 Projet Universitaire / Examen
Ce projet a été réalisé avec rigueur en combinant des architectures logicielles modernes, des performances optimales avec cache local, et une expérience utilisateur soignée de type premium.
