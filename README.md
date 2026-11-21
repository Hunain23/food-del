# Food Delivery Application

A full-stack food delivery application built with React, Node.js, Express, MongoDB, and Stripe.

## Repository Structure

```
Food-Del/
├── backend/          # Express API server & MongoDB connection
├── frontend/         # Customer-facing React app (Vite)
├── admin/            # Admin dashboard React app (Vite)
├── package.json      # Root package scripts for convenience
└── .gitignore        # Monorepo-wide ignore rules
```

## Quick Start (Local Development)

### 1. Install Dependencies

You can install all dependencies from the root directory:
```bash
npm run install:all
```
Or manually in each folder:
```bash
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install
```

### 2. Configure Environment Variables

#### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env` and update the values:
```env
PORT=4000
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret"
STRIPE_SECRET_KEY="your_stripe_secret_key"
FRONTEND_URL="http://localhost:5173"
```

#### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_BACKEND_URL="http://localhost:4000"
```

#### Admin (`admin/.env`)
Copy `admin/.env.example` to `admin/.env`:
```env
VITE_BACKEND_URL="http://localhost:4000"
```

### 3. Run Applications

From the root directory:
- **Backend**: `npm run backend:dev` (runs on http://localhost:4000)
- **Frontend**: `npm run frontend` (runs on http://localhost:5173)
- **Admin**: `npm run admin` (runs on http://localhost:5174)

## Deployment Guide

### Backend (e.g. Render / Railway / Heroku)
1. Set the root directory / working directory to `backend`.
2. Build command: `npm install`
3. Start command: `node server.js`
4. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `FRONTEND_URL` (your deployed frontend URL)

### Frontend (e.g. Vercel / Netlify)
1. Set root directory to `frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variable:
   - `VITE_BACKEND_URL` (your deployed backend API URL, e.g. `https://your-backend.onrender.com`)

### Admin Panel (e.g. Vercel / Netlify)
1. Set root directory to `admin`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variable:
   - `VITE_BACKEND_URL` (your deployed backend API URL)
