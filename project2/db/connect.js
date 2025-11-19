const { MongoClient } = require('mongodb');
require('dotenv').config();

let client;
let db;

async function initDb() {
  if (db) return db;
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI; // Render may use MONGO_URI
  const dbName = process.env.DB_NAME || 'project2db';
  if (!uri) throw new Error('Missing Mongo connection string: set MONGODB_URI or MONGO_URI');
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log(`Connected to MongoDB database: ${dbName}`);
  return db;
}

function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDb first.');
  return db;
}

module.exports = { initDb, getDb };
