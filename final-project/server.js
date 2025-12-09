require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const { initDb } = require('./config/db');
const swaggerSpec = require('./config/swagger');
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI is required for session management');
  process.exit(1);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      touchAfter: 24 * 3600
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth routes
app.use('/auth', require('./routes/auth'));

// Routes
app.use('/users', require('./routes/users'));
app.use('/recipes', require('./routes/recipes'));
app.use('/meal-plans', require('./routes/mealPlans'));
app.use('/grocery-lists', require('./routes/groceryLists'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Recipe & Meal Planning API',
    documentation: '/api-docs',
    authenticated: req.isAuthenticated ? req.isAuthenticated() : false,
    endpoints: {
      users: '/users',
      recipes: '/recipes',
      mealPlans: '/meal-plans',
      groceryLists: '/grocery-lists',
      auth: '/auth/google'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    availableRoutes: ['/', '/users', '/recipes', '/meal-plans', '/grocery-lists', '/auth/google', '/api-docs']
  });
});

// Initialize database and start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ API Documentation: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
