# Project 2 (Weeks 03-04)

## Overview
New API with two collections: `books` and `authors`. Week 03 delivers full CRUD with validation & error handling. Week 04 adds OAuth security.

## Collections
- **books** (>=7 fields): title, authorId, isbn, publishedYear, genre, pageCount, price, inStock, createdAt
- **authors**: firstName, lastName, country, birthDate, createdAt

## Environment Variables (.env)
```
MONGODB_URI=YOUR_CONNECTION_STRING
DB_NAME=project2db
PORT=3001
```

## Install & Run
```powershell
npm install
npm start
```

## Endpoints (Week 03)
- Books: GET /books, GET /books/:id, POST /books, PUT /books/:id, DELETE /books/:id
- Authors: GET /authors, GET /authors/:id, POST /authors, PUT /authors/:id, DELETE /authors/:id
- Swagger UI: /api-docs

## Validation
Implemented with Joi (all required fields enforced; types checked; price positive; year range).

## Next (Week 04)
Add OAuth (e.g. Google) login flow; protect POST/PUT/DELETE.
