# HAIBAZO Book Review

Full-stack implementation of `HAIBAZO_Intern SE_Entrance Test (Round 2).xlsx`.

## Stack

- Frontend: ReactJS + Vite
- Backend: Spring Boot
- Database: PostgreSQL

## Implemented Requirements

- Authors list/create/update/delete screens
- Books list/create/update/delete screens
- Reviews list/create/update/delete screens
- Validation messages from the workbook
- Modal update/delete flows
- PostgreSQL persistence through Spring Data JPA
- Seed data matching the workbook examples
- Responsive HAIBAZO themed UI

## Run Locally

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Run the backend:

```bash
cd backend
mvn spring-boot:run
```

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

If Docker is unavailable, create a PostgreSQL database named `haibazo_book_review` with user/password `haibazo`/`haibazo`, or override the values with the environment variables listed in `backend/.env.example`.

## API

- `GET/POST /api/authors`
- `PUT/DELETE /api/authors/{id}`
- `GET/POST /api/books`
- `PUT/DELETE /api/books/{id}`
- `GET/POST /api/reviews`
- `PUT/DELETE /api/reviews/{id}`

## Verification

```bash
cd backend && mvn test
cd frontend && npm run build
```

## Free Deploy Recommendation

For this repository, the simplest free setup is:

- Frontend React: Vercel
- Backend Spring Boot: Render
- Database PostgreSQL: Neon

This split works well with the current codebase because:

- the frontend already supports `VITE_API_BASE_URL`
- the backend already supports `PORT`
- the backend already reads PostgreSQL settings from environment variables
- CORS can be configured with `APP_CORS_ALLOWED_ORIGINS`

Important limitation:

- Render free web services spin down after 15 minutes of inactivity, so the first request may be slow
- free hosting is good for demo / portfolio / test projects, not production traffic

## 1. Push The Repo To GitHub

If this project is not on GitHub yet:

```bash
git init
git add .
git commit -m "Prepare project for deployment"
```

Then create a GitHub repository and push the code.

## 2. Create A Free PostgreSQL Database On Neon

1. Sign in to Neon.
2. Create a new project.
3. Copy the PostgreSQL connection string.
4. Keep these values for backend deploy:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Example JDBC URL format for Spring Boot:

```text
jdbc:postgresql://YOUR_NEON_HOST/YOUR_DB?sslmode=require
```

If Neon gives you a non-JDBC URL like:

```text
postgresql://user:password@host/db?sslmode=require
```

convert it to:

```text
jdbc:postgresql://host/db?sslmode=require
```

and put username/password into the separate Spring variables.

## 3. Deploy Backend Spring Boot On Render

This repository now includes [backend/Dockerfile](backend/Dockerfile), so Render can build the backend directly from Docker.

Create a new Render `Web Service` with these settings:

- Root directory: `backend`
- Environment: `Docker`
- Instance type: `Free`

Set environment variables in Render:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://YOUR_NEON_HOST/YOUR_DB?sslmode=require
SPRING_DATASOURCE_USERNAME=YOUR_NEON_USER
SPRING_DATASOURCE_PASSWORD=YOUR_NEON_PASSWORD
APP_CORS_ALLOWED_ORIGINS=https://YOUR-FRONTEND-DOMAIN.vercel.app
APP_SEED_ENABLED=true
```

Notes:

- do not set `PORT` manually on Render unless needed; Render provides it automatically
- after deploy, copy your backend URL, for example `https://haibazo-api.onrender.com`

## 4. Deploy Frontend React On Vercel

Create a new Vercel project from the same GitHub repo with these settings:

- Framework preset: `Vite`
- Root directory: `frontend`

Set environment variable:

```text
VITE_API_BASE_URL=https://YOUR-BACKEND-NAME.onrender.com
```

Then deploy.

After Vercel gives you a frontend URL like:

```text
https://haibazo-book-review.vercel.app
```

go back to Render and update:

```text
APP_CORS_ALLOWED_ORIGINS=https://haibazo-book-review.vercel.app
```

If you want to support both production and local frontend, use:

```text
APP_CORS_ALLOWED_ORIGINS=https://haibazo-book-review.vercel.app,http://localhost:5173,http://127.0.0.1:5173
```

## 5. Verify After Deploy

Check these URLs:

- frontend home page loads successfully
- `https://YOUR-BACKEND.onrender.com/api/authors`
- create/update/delete author, book, and review from the UI

If the frontend loads but API calls fail, the most common causes are:

- wrong `VITE_API_BASE_URL`
- wrong `APP_CORS_ALLOWED_ORIGINS`
- wrong Neon JDBC URL or credentials

## Alternative: Deploy Both Frontend And Backend On Render

If you want fewer services to manage:

- frontend: Render `Static Site`
- backend: Render `Web Service`
- database: Neon

This also works, but Vercel usually gives the easiest React frontend experience.
