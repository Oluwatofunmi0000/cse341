const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../db/connect');

// GET all contacts
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const contacts = await db.collection('contacts').find().toArray();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
});

// GET single contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid contact ID' });
    }
    
    const db = getDatabase();
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(contactId) });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact', error: error.message });
  }
});

module.exports = router;
