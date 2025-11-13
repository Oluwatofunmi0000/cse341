require('dotenv').config();
const express = require('express');
const app = express();
const { connectToDb } = require('./db/mongo');
const contactsRouter = require('./routes/contacts');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Rose Oyaleke');
});

// optional health endpoint
app.get('/health', (req, res) => res.send('ok'));

app.use('/contacts', contactsRouter);

connectToDb()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`web server is listening at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });