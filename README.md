# CampusKart - College Student Marketplace (Full-Stack Architecture)

CampusKart is a peer-to-peer college marketplace allowing university students to buy and sell used textbooks, calculators, lab gear, and hostel essentials directly with peers on campus.

## Project Structure (Separated Frontend & Backend)

```
campuskart/
├── backend/                  # Standalone Node.js + Express REST API
│   ├── src/
│   │   └── server.ts         # Express server, JWT auth, product catalog & orders
│   ├── schema.sql            # PostgreSQL Database Schema DDL
│   ├── package.json          # Backend dependencies (express, cors, dotenv, tsx)
│   ├── tsconfig.json         # TypeScript configuration
│   ├── .env.example          # Port & Database URL configuration
│   └── README.md             # Backend setup & documentation
│
├── frontend/                 # Standalone React + Vite + Tailwind CSS Web App
│   ├── src/                  # React components, types, services, assets
│   ├── public/               # Public static assets
│   ├── index.html            # Entry HTML point
│   ├── package.json          # Frontend dependencies (react 19, tailwindcss v4, lucide)
│   ├── vite.config.ts        # Vite config with API proxy
│   ├── tsconfig.json         # TypeScript configuration
│   ├── .env.example          # Frontend environment variables
│   └── README.md             # Frontend setup & documentation
│
└── campuskart-fullstack.zip  # Complete download archive containing both projects
```

## Running the Application Locally

### 1. Start the Backend API (Port 5000)
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend App (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to access CampusKart.
