require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport');
const { initDb } = require('./db/connect');
const authRouter = require('./routes/auth');
const authorsRouter = require('./routes/authors');
const booksRouter = require('./routes/books');
const { setupSwagger } = require('./swagger');

const app = express();
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || process.env.MONGO_URI,
      dbName: process.env.DB_NAME || 'project2db'
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Basic health route
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Project2 API', 
    docs: '/api-docs',
    authenticated: req.isAuthenticated() 
  });
});

// Auth routes
app.use('/auth', authRouter);

// API Routers
app.use('/authors', authorsRouter);
app.use('/books', booksRouter);

// Swagger
setupSwagger(app);

const PORT = process.env.PORT || 3001;

// Global error/rejection logging to help diagnose silent exits
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Start server after DB ready
(async () => {
  try {
    await initDb();
    console.log('Database initialized');
    app.listen(PORT, () => {
      console.log(`Project2 server listening on port ${PORT}`);
      console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('Failed to initialize database', err);
    process.exit(1);
  }
})();
