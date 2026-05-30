# 🌟 Style ton humeur (Humeur & Look)

> **Plateforme intelligente d'aide au choix et de recommandation de tenues, routines et playlists adaptées au mood et à la météo journalière.**

Ce projet est développé dans le cadre d'un projet académique (Examen Mobile) par :
* **BENTALEB Chaymae** (Directrice Frontend & UI/UX)
* **FARIDI Marwane** (Directeur Backend, Données & Métier)
* **KAF Abdessamad** (Directeur IA & Intégrations)

---

## 🛠️ Stack Technique

* **Frontend** : React Native & Expo (TypeScript), Expo Router, React Native Reanimated.
* **Backend** : NestJS (TypeScript), Prisma ORM.
* **Base de données** : MySQL (via XAMPP / Laragon).
* **Intelligence Artificielle** : Google Gemini 2.5 Flash API.
* **APIs Externes** : Open-Meteo API (Météo sans clé), Deezer API (Musique).

---

## 📂 Architecture des Dossiers

```text
MobileExamen/
│
├── backend/                       # 🛡️ NestJS Backend API (TypeScript)
│   ├── src/
│   │   ├── auth/                  # Module Auth (JWT, Passport, Hachage)
│   │   ├── users/                 # Module Users (Profils)
│   │   ├── weather/               # Module Météo (API Open-Meteo)
│   │   ├── ai/                    # Module IA (Gemini API & Fallback de secours)
│   │   ├── prisma/                # Client Prisma ORM
│   │   └── main.ts                # Point d'entrée de l'API (Préfixe global /api, CORS activés)
│   │       
│   ├── prisma/
│   │   └── schema.prisma          # Schéma de base de données MySQL
│   └── .env                       # Configuration locale (Ignoré par Git)
│
└── frontend/                      # 📱 Expo React Native App (TypeScript)
    ├── app/                       # Expo Router Structure (Onglets & Routes)
    └── package.json               # Dépendances NPM du Front
```

---

## 🚀 Démarrage du Projet

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
2. Créez un fichier `.env` à la racine de `/backend` (s'il n'existe pas) et mettez-y votre connexion MySQL locale :
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/style_ton_humeur"
   JWT_SECRET="super-secret-key-facile-a-changer-en-prod"
   GEMINI_API_KEY="VOTRE_CLE_GOOGLE_AI_STUDIO"
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
