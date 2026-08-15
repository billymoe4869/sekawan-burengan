# Sekawan Burengan

A local UMKM directory platform for Burengan, built with React + Vite on the frontend and Express + Prisma on the backend.

## Stack
- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, Prisma, PostgreSQL
- Authentication: JWT with role-based access control for Owner and Admin

## Project structure
- `frontend/` — React app and pages
- `backend/` — Express API server
- `prisma/` — Prisma schema and seed
- `generated/` — generated Prisma client output

## Setup
1. Copy `.env.example` to `.env` and fill in the values.
2. Install dependencies:
   npm install
3. Start database and run Prisma migrations:
   npx prisma migrate dev
4. Run the app in development mode:
   npm run dev

## Useful commands
- `npm run dev:frontend` — frontend only
- `npm run dev:backend` — backend only
- `npm run build` — production build
- `npm run lint` — lint validation

## Environment variables
Required values include:
- `DATABASE_URL`
- `JWT_SECRET`
- Cloudinary values for image upload support

## Notes
This project is configured for a local PostgreSQL database and role-based access for `Owner` and `Admin` users.

