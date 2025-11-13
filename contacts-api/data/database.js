// database.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

let _db; // cached database connection

/**
 * Initialize MongoDB connection
 * @param {Function} callback - callback(err, db)
 */
const initDb = async (callback) => {
  try {
    if (_db) {
      console.log("⚠️ Database already initialized!");
      return callback(null, _db);
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return callback("❌ MONGODB_URI is not defined in .env", null);
    }

    const client = await MongoClient.connect(uri);

    _db = client.db("contactsdb"); // <-- replace with your DB name
    console.log("✅ Connected to MongoDB Atlas!");
    callback(null, _db);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    callback(err);
  }
};

/**
 * Get the active DB instance
 */
const getDb = () => {
  if (!_db) {
    throw new Error("❌ Database not initialized! Call initDb first.");
  }
  return _db;
};

module.exports = { initDb, getDb };..
