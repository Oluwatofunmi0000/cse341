const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Update with your connection string
const client = new MongoClient(uri);

async function createContact(contact) {
  try {
    await client.connect();
    const db = client.db('contactsDB'); // Use your database name
    const collection = db.collection('contacts');
    const result = await collection.insertOne(contact);
    return result;
  } finally {
    await client.close();
  }
}

// Example usage:
const newContact = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '1234567890',
  address: '123 Main St'
};

createContact(newContact)
  .then(result => console.log('Contact inserted:', result.insertedId))
  .catch(err => console.error(err));..



  /*
  
 const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true, min: 2,max: 50 },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String }
});

module.exports = mongoose.model('Contact', contactSchema); 
  
  */