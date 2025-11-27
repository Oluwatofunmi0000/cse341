# Project 2 (Weeks 03-04)

## Overview

Full-stack CRUD API with two collections: `books` and `authors`. Week 03 delivered CRUD with validation & error handling. **Week 04 adds Google OAuth authentication** to secure POST, PUT, DELETE operations.

## Collections

- **authors** (5 required fields): firstName, lastName, email, country, birthDate
- **books** (8 required fields): title, isbn, authorId (ref to authors), publishedYear, genres[], pages, language, inPrint

## Environment Variables (.env)

```env
MONGODB_URI=YOUR_CONNECTION_STRING
DB_NAME=project2db
PORT=3001

# Google OAuth (Week 04)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
SESSION_SECRET=random-secret-key
```

## Google OAuth Setup

### 1. Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → Create Credentials → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   - `http://localhost:3001/auth/google/callback` (local)
   - `https://your-render-url.onrender.com/auth/google/callback` (production)
7. Copy **Client ID** and **Client Secret** to `.env`

### 2. Install Dependencies

```powershell
cd project2
npm install
```

### 3. Run Locally

```powershell
npm start
```

Visit `http://localhost:3001/api-docs` for Swagger documentation.

## Authentication Flow

### Login

1. Navigate to `/auth/google` in browser
2. Redirects to Google login
3. After authentication, redirects to `/auth/login/success`
4. Session cookie stored (24 hour expiry)

### Logout

- GET `/auth/logout` destroys session

### Check Auth Status

- GET `/auth/status` returns `{ authenticated: true/false, user: {...} }`

## Protected Endpoints (Require Authentication)

- **POST** `/authors` - Create author
- **PUT** `/authors/:id` - Update author
- **DELETE** `/authors/:id` - Delete author
- **POST** `/books` - Create book
- **PUT** `/books/:id` - Update book
- **DELETE** `/books/:id` - Delete book

## Public Endpoints (No Auth Required)

- **GET** `/authors` - List all authors
- **GET** `/authors/:id` - Get author by ID
- **GET** `/books` - List all books
- **GET** `/books/:id` - Get book by ID

## API Testing

### Using Swagger UI

1. Navigate to `/api-docs`
2. Click **Authorize** button (top right)
3. Click on OAuth2 flow to initiate Google login
4. After login, test protected endpoints

### Using Browser/Postman

1. First login: Visit `/auth/google` in browser
2. Copy session cookie from browser
3. Use cookie in Postman/REST client for subsequent requests

## Validation

All fields validated using Joi:

- Authors: email format, date format (YYYY-MM-DD), string lengths
- Books: ISBN format, year range (1450-current), genres array (1-5 items), positive page count

## Error Handling

- **401 Unauthorized**: Authentication required
- **400 Bad Request**: Validation errors
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Database/server errors

## Deployment (Render)

### Environment Variables on Render

Add these in Render dashboard → Service → Environment:

```
MONGODB_URI=your-atlas-connection-string
DB_NAME=project2db
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_CALLBACK_URL=https://your-app.onrender.com/auth/google/callback
SESSION_SECRET=random-production-secret
```

### Testing Production

1. Visit `https://your-app.onrender.com/auth/google`
2. Complete Google OAuth
3. Test CRUD operations via `/api-docs`

## Project Structure

```
project2/
├── config/
│   └── passport.js          # Google OAuth strategy
├── controllers/
│   ├── authorsController.js # Author CRUD logic
│   └── booksController.js   # Book CRUD logic
├── db/
│   └── connect.js           # MongoDB connection
├── middleware/
│   └── auth.js              # isAuthenticated middleware
├── routes/
│   ├── auth.js              # OAuth routes
│   ├── authors.js           # Author endpoints
│   └── books.js             # Book endpoints
├── validation/
│   └── schemas.js           # Joi validation schemas
├── server.js                # Express app with session/passport
├── swagger.js               # OpenAPI documentation
└── package.json
```

## Week 04 Submission Checklist

- [x] OAuth implementation (Google)
- [x] Protected POST/PUT/DELETE endpoints
- [x] Public GET endpoints
- [x] Session management
- [x] Swagger documentation updated
- [x] Error handling for unauthorized access
- [ ] Deploy to Render with OAuth configured
- [ ] Record 5-8 minute demo video
- [ ] Submit: GitHub repo + Render URL + YouTube video
