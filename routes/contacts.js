const { Router } = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const contacts = await getDb().collection('contacts').find({}).toArray();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const contact = await getDb().collection('contacts').findOne({ _id: new ObjectId(id) });
    if (!contact) return res.status(404).json({ error: 'Not found' });
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

module.exports = router;