const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { initDb } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Routes
app.use('/contacts', require('./routes/contacts'));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Initialize database and start server
initDb((err) => {
  if (err) {
    console.log('Failed to connect to database:', err);
  } else {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log('Database connected successfully');
    });
  }
});
