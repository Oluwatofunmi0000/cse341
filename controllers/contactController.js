const { ObjectId } = require('mongodb');
const { getDatabase } = require('../db/connect');

const validatePayload = (body) => {
  const { firstName, lastName, email, favoriteColor, birthday } = body || {};
  if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
    return 'All fields are required: firstName, lastName, email, favoriteColor, birthday';
  }
  return null;
};

// GET /contacts
const getAllContacts = async (req, res) => {
  try {
    const db = getDatabase();
    const contacts = await db.collection('contacts').find().toArray();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
};

// GET /contacts/:id
const getContactById = async (req, res) => {
  try {
    const contactId = req.params.id;
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
};

// POST /contacts
const createContact = async (req, res) => {
  try {
    const validationError = validatePayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    const newContact = { firstName, lastName, email, favoriteColor, birthday };
    const db = getDatabase();
    const result = await db.collection('contacts').insertOne(newContact);
    if (result.acknowledged) {
      return res.status(201).json({ id: result.insertedId });
    }
    res.status(500).json({ message: 'Failed to create contact' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating contact', error: error.message });
  }
};

// PUT /contacts/:id
const updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid contact ID' });
    }
    const validationError = validatePayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    const updatedContact = { firstName, lastName, email, favoriteColor, birthday };
    const db = getDatabase();
    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(contactId) },
      { $set: updatedContact }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact', error: error.message });
  }
};

// DELETE /contacts/:id
const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid contact ID' });
    }
    const db = getDatabase();
    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(contactId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
