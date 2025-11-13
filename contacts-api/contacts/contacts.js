const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;


const newContact = async (req, res) => {
    try {
        const { birthday, favoriteColor,firstName,lastName, email, phone } = req.body;
        if (!firstName || !lastName || !email || !birthday || !favoriteColor) {
            return res.status(400).json({ error: 'First name, last name, and email are required.' });
        }
        const newContact = await mongodb
        .getDb()
        .collection('contacts')
        .insertOne({ FirstName :firstName,LastName: lastName,Email: email,FavoriteColor: favoriteColor,Birthday: birthday,Phone: phone });
        res.status(201).json(newContact);
    } catch (error) {
        console.log('Error creating contact:', error);
        res.status(500).json({ error: 'An error occurred while creating the contact.' });
    }
}

const getAllContacts = async (req, res) => {
    //#swagger.tags = ['Contacts']
    const result = await mongodb.getDb().collection('contacts').find();
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts);
    });
};

const getContactById = async (req, res) => {
    //#swagger.tags = ['Contacts']
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('contacts').find({ _id: userId });
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts[0]);
    });
};

const createContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday,
    };
    const response = await mongodb.getDb().collection('contacts').insertOne(contact);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Could not create contact');
    }
}

const updateContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    const userId = new ObjectId(req.params.id);
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday,
    };
    const response = await mongodb.getDb().collection('contacts').replaceOne({ _id: userId }, contact);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Could not update contact');
    }
};

const deleteContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().collection('contacts').deleteOne({ _id: userId }, true);
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Could not delete contact');
    }
}







module.exports = {
    newContact,
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};
