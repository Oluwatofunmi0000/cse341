const express = require('express');
const router = express.Router();
const {getAllContacts, getContactById, createContact, updateContact} = require('../contacts/contacts');
const contactsController = require('./contacts');

router.get('/', contactsController.getAllContacts);
router.get('/:id', contactsController.getContactById);
router.post('/', contactsController.newContact);
router.put('/:id', contactsController.updateContact);
router.delete('/:id', contactsController.deleteContact);
module.exports = router;

/**
 * POST comes into server.js => /contacts => contatctRoute.js => contacts.js it will run newContact function
 * GET /contacts => contatctRoute.js => contacts.js it will run getAllContacts function
 * GET /contacts/:id => contatctRoute.js => contacts.js it will run getContactById function
 * 
 * 
 */
