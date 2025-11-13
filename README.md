# W01 Project: Contacts Part 1

## Overview

This Node.js project provides a REST API for managing contacts stored in MongoDB. This is Part 1 of a two-week project (GET endpoints only).

## Project Structure

```
cse341/
├── db/
│   └── connect.js          # MongoDB connection module
├── routes/
│   └── contacts.js         # Contact routes (GET endpoints)
├── server.js               # Main server file
├── contacts.rest           # REST client test file
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore file
└── package.json            # Node dependencies
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MongoDB

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string
5. Copy `.env.example` to `.env`
6. Update the `MONGODB_URI` in `.env` with your connection string

Example `.env` file:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/contacts?retryWrites=true&w=majority
```

### 3. Create Contacts Collection and Insert Data

In MongoDB Atlas:

1. Create a database (if not already created)
2. Create a collection named `contacts`
3. Insert at least 3 documents with the following structure:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "favoriteColor": "Blue",
  "birthday": "1990-05-15"
}
```

Example documents:

```json
[
  {
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice.smith@email.com",
    "favoriteColor": "Green",
    "birthday": "1992-03-20"
  },
  {
    "firstName": "Bob",
    "lastName": "Johnson",
    "email": "bob.johnson@email.com",
    "favoriteColor": "Red",
    "birthday": "1988-11-10"
  },
  {
    "firstName": "Carol",
    "lastName": "Williams",
    "email": "carol.williams@email.com",
    "favoriteColor": "Purple",
    "birthday": "1995-07-25"
  }
]
```

### 4. Run the Server Locally

```bash
node server.js
```

The server will start on port 3000 (or the PORT environment variable if set).

## API Endpoints (Part 1)

### GET /

- **Description**: Returns "Hello World"
- **Response**: Plain text

### GET /contacts

- **Description**: Get all contacts
- **Response**: JSON array of all contacts

### GET /contacts/:id

- **Description**: Get a single contact by ID
- **Parameters**:
  - `id` (path parameter) - MongoDB ObjectId of the contact
- **Response**: JSON object of the contact
- **Error Responses**:
  - 400: Invalid contact ID format
  - 404: Contact not found
  - 500: Server error

## Testing the API

### Using the REST Client Extension

1. Install the "REST Client" extension in VS Code
2. Open `contacts.rest`
3. Update `@baseUrl` with your server URL (local or Render)
4. Replace `YOUR_CONTACT_ID_HERE` with an actual contact ID from your database
5. Click "Send Request" above each request to test

### Using Other Tools

You can also use:

- Postman
- Thunder Client
- curl commands
- Any HTTP client

## Deployment to Render

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - W01 Project Part 1"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy to Render

1. Go to https://render.com and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: Choose a name for your service
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - Click "Advanced"
   - Add `MONGODB_URI` with your MongoDB connection string
6. Click "Create Web Service"
7. Wait for deployment to complete
8. Your API will be available at `https://your-service-name.onrender.com`

### Testing on Render

Update the `@baseUrl` in `contacts.rest` to your Render URL and test the endpoints.

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **dotenv**: Environment variable management

## Week 02 Preview

In Week 02, you will add:

- POST endpoint (create new contact)
- PUT endpoint (update existing contact)
- DELETE endpoint (delete contact)
- Swagger API documentation
- Video demonstration

## Important Notes

- Never commit your `.env` file to GitHub
- Always use environment variables for sensitive data
- Test locally before deploying to Render
- Make sure your MongoDB cluster allows connections from anywhere (0.0.0.0/0) for Render to connect

## Support

If you encounter issues:

1. Check that your MongoDB connection string is correct
2. Verify that your database has the `contacts` collection with data
3. Ensure all npm packages are installed
4. Check the console for error messages
5. Review the tutorial videos provided in the assignment

## Submission Checklist

- [ ] GitHub repository created and code pushed
- [ ] .env file NOT pushed to GitHub
- [ ] MongoDB database created with contacts collection
- [ ] At least 3 contacts inserted into the database
- [ ] GET all contacts endpoint working
- [ ] GET single contact by ID endpoint working
- [ ] Application deployed to Render
- [ ] Render environment variables configured
- [ ] contacts.rest file included for testing
- [ ] Brief video demonstration created and uploaded to YouTube
- [ ] GitHub, Render, and YouTube links submitted in Canvas
