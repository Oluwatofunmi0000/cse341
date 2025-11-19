// Run this script once to insert sample contacts into MongoDB
// Command: node insertContacts.js

require('dotenv').config();
const { MongoClient } = require('mongodb');

const sampleContacts = [
  {
    firstName: "Alice",
    lastName: "Smith",
    email: "alice.smith@email.com",
    favoriteColor: "Green",
    birthday: "1992-03-20"
  },
  {
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@email.com",
    favoriteColor: "Red",
    birthday: "1988-11-10"
  },
  {
    firstName: "Carol",
    lastName: "Williams",
    email: "carol.williams@email.com",
    favoriteColor: "Purple",
    birthday: "1995-07-25"
  },
  {
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@email.com",
    favoriteColor: "Blue",
    birthday: "1990-05-15"
  }
];

async function insertContacts() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db();
    const collection = database.collection('contacts');
    
    // Check if contacts already exist
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} contacts.`);
      console.log('Do you want to add more? Delete existing ones first or modify this script.');
      return;
    }
    
    // Insert sample contacts
    const result = await collection.insertMany(sampleContacts);
    console.log(`${result.insertedCount} contacts inserted successfully!`);
    console.log('Inserted IDs:', result.insertedIds);
    
    // Display all contacts
    const allContacts = await collection.find().toArray();
    console.log('\nAll contacts in database:');
    allContacts.forEach((contact, index) => {
      console.log(`\n${index + 1}. ${contact.firstName} ${contact.lastName}`);
      console.log(`   ID: ${contact._id}`);
      console.log(`   Email: ${contact.email}`);
      console.log(`   Color: ${contact.favoriteColor}`);
      console.log(`   Birthday: ${contact.birthday}`);
    });
    
  } catch (error) {
    console.error('Error inserting contacts:', error.message);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed.');
  }
}

insertContacts();
