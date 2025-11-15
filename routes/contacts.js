const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../db/connect');

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contacts management
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: List of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *     responses:
 *       200:
 *         description: A single contact
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Created. Returns the new contact id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
// POST - Create a new contact
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    // Validate all required fields
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ 
        message: 'All fields are required: firstName, lastName, email, favoriteColor, birthday' 
      });
    }
    
    const newContact = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    };
    
    const db = getDatabase();
    const result = await db.collection('contacts').insertOne(newContact);
    
    if (result.acknowledged) {
      res.status(201).json({ id: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create contact' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating contact', error: error.message });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       204:
 *         description: Updated successfully (no content)
 *       400:
 *         description: Validation/ID error
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
// PUT - Update a contact by ID
router.put('/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid contact ID' });
    }
    
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    // Validate all required fields
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({ 
        message: 'All fields are required: firstName, lastName, email, favoriteColor, birthday' 
      });
    }
    
    const updatedContact = {
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    };
    
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
});

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
// DELETE - Delete a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    
    // Validate if the ID is a valid MongoDB ObjectId
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
});

module.exports = router;
