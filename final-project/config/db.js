const { MongoClient } = require('mongodb');
require('dotenv').config();

let client;
let db;

async function initDb() {
  if (db) return db;
  
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'recipe_meal_planning';
  
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log(`✓ Connected to MongoDB database: ${dbName}`);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

async function closeDb() {
  if (client) {
    await client.close();
    console.log('Database connection closed');
  }
}

module.exports = { initDb, getDb, closeDb };
