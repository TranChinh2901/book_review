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
