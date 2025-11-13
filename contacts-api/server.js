require('dotenv').config(); // Load .env first

const express = require('express');
const mongodb = require('./data/database.js');
const app = express();
const contactRoutes = require('./contacts/contactRoute.js');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
    next();
});
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Contacts API' });
});
app.use('/contacts', contactRoutes);

// Database and server start
mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(PORT, () => {
            console.log(`Database is connected and Server is running on port ${PORT}`);
        });
    }
});...
