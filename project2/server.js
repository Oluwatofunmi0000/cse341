require('dotenv').config();
const express = require('express');
const { initDb } = require('./db/connect');
const authorsRouter = require('./routes/authors');
const booksRouter = require('./routes/books');
const { setupSwagger } = require('./swagger');

const app = express();
app.use(express.json());

// Basic health route
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Project2 API', docs: '/api-docs' });
});

// Routers
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
