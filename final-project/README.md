# Recipe & Meal Planning API

A comprehensive REST API for managing recipes, meal plans, and grocery lists. Built with Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Team Contributions](#team-contributions)
- [Deployment](#deployment)

## ✨ Features

- **User Management**: Create and manage user accounts with dietary preferences
- **Recipe CRUD**: Full create, read, update, delete operations for recipes
- **Validation**: Joi schema validation for all inputs
- **Error Handling**: Comprehensive error messages and status codes
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **MongoDB Integration**: Persistent storage with relationship management

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with native driver
- **Validation**: Joi
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Development**: Nodemon for auto-reload
- **Deployment**: Render

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd final-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=recipe_meal_planning
   PORT=3000
   ```

4. **Start the server**

   Development mode (with auto-reload):

   ```bash
   npm run dev
   ```

   Production mode:

   ```bash
   npm start
   ```

5. **Access the API**
   - API Base: `http://localhost:3000`
   - Documentation: `http://localhost:3000/api-docs`

## 📡 API Endpoints

### Users

| Method | Endpoint     | Description     |
| ------ | ------------ | --------------- |
| GET    | `/users`     | Get all users   |
| GET    | `/users/:id` | Get user by ID  |
| POST   | `/users`     | Create new user |
| PUT    | `/users/:id` | Update user     |
| DELETE | `/users/:id` | Delete user     |

### Recipes

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| GET    | `/recipes`     | Get all recipes   |
| GET    | `/recipes/:id` | Get recipe by ID  |
| POST   | `/recipes`     | Create new recipe |
| PUT    | `/recipes/:id` | Update recipe     |
| DELETE | `/recipes/:id` | Delete recipe     |

### Example Request: Create User

```bash
POST http://localhost:3000/users
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "displayName": "John Doe",
  "dietaryPreferences": ["vegetarian", "gluten-free"]
}
```

### Example Request: Create Recipe

```bash
POST http://localhost:3000/recipes
Content-Type: application/json

{
  "title": "Classic Margherita Pizza",
  "description": "A traditional Italian pizza with fresh ingredients",
  "ingredients": ["2 cups flour", "1 cup water", "200g mozzarella"],
  "instructions": ["Mix dough", "Let rise", "Add toppings", "Bake"],
  "prepTime": 20,
  "cookTime": 15,
  "servingSize": 4,
  "difficulty": "Medium",
  "cuisine": "Italian",
  "tags": ["pizza", "vegetarian"],
  "authorId": "507f1f77bcf86cd799439011"
}
```

## 👥 Team Contributions

### Week 05 Deliverables

Each team member should document their contributions here:

**Team Member 1**: [Your Name]

- Contribution 1: [Description]
- Contribution 2: [Description]

**Team Member 2**: [Name]

- Contribution 1: [Description]
- Contribution 2: [Description]

**Team Member 3**: [Name]

- Contribution 1: [Description]
- Contribution 2: [Description]

**Team Member 4**: [Name]

- Contribution 1: [Description]
- Contribution 2: [Description]

## 🌐 Deployment

### Deploy to Render

1. **Create Render Account** at [render.com](https://render.com)

2. **Create New Web Service**

   - Connect your GitHub repository
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables**

   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `DB_NAME`: `recipe_meal_planning`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Access your API at `https://your-app.onrender.com`
   - View docs at `https://your-app.onrender.com/api-docs`

## 🧪 Testing

Use the included `final-project.rest` file with REST Client extension in VS Code, or test via Swagger UI at `/api-docs`.

### Testing with PowerShell

```powershell
# Get all users
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method Get

# Create user
$body = @{
    email = "test@example.com"
    displayName = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/users" -Method Post -Body $body -ContentType "application/json"
```

## 📝 Project Structure

```
final-project/
├── config/
│   ├── db.js           # MongoDB connection
│   └── swagger.js      # Swagger configuration
├── controllers/
│   ├── usersController.js
│   └── recipesController.js
├── routes/
│   ├── users.js
│   └── recipes.js
├── validation/
│   └── schemas.js      # Joi validation schemas
├── .env.example        # Environment template
├── .gitignore
├── final-project.rest  # REST Client tests
├── package.json
├── README.md
└── server.js           # Entry point
```

## 📚 Validation Rules

### User Schema

- `email`: Valid email format, required, unique
- `displayName`: 2-60 characters, required
- `dietaryPreferences`: Array of strings, optional

### Recipe Schema

- `title`: 3-100 characters, required
- `description`: 10-500 characters, required
- `ingredients`: 1-30 items, required
- `instructions`: 1-20 steps, required
- `prepTime`: 1-300 minutes, required
- `cookTime`: 1-600 minutes, required
- `servingSize`: 1-20 servings, required
- `difficulty`: Enum (Easy, Medium, Hard), required
- `cuisine`: 2-30 characters, required
- `tags`: Array of strings, optional
- `authorId`: Valid MongoDB ObjectId, required

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Validation failed",
  "details": ["Email is required", "Display name must be at least 2 characters"]
}
```

HTTP Status Codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `404`: Not Found
- `500`: Internal Server Error

## 📄 License

This project is created for educational purposes as part of CSE341 coursework.

## 🤝 Contributing

This is a team project. Please follow these guidelines:

1. Create feature branches for new work
2. Submit pull requests for review
3. Write clear commit messages
4. Test locally before pushing
5. Update documentation as needed

## 📞 Support

For questions or issues, contact the team or instructor.
