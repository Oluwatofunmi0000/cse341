require('dotenv').config();
const { MongoClient } = require('mongodb');

let client;
let db;

async function connectToDb() {
  if (db) return db;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI in .env');
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.DB_NAME || 'contactsDB');
  console.log('Connected to MongoDB');
  return db;
}

function getDb() {
  if (!db) throw new Error('Database has not been initialized. Call connectToDb() first.');
  return db;
}

module.exports = { connectToDb, getDb };const { Router } = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const contacts = await getDb().collection('contacts').find({}).toArray();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const contact = await getDb().collection('contacts').findOne({ _id: new ObjectId(id) });
    if (!contact) return res.status(404).json({ error: 'Not found' });
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

module.exports = router;