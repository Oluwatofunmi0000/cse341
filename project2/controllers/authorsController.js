const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { authorSchema, validate } = require('../validation/schemas');

async function listAuthors(req, res) {
  try {
    const authors = await getDb().collection('authors').find().toArray();
    res.status(200).json(authors);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching authors', error: e.message });
  }
}

async function getAuthor(req, res) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid author ID' });
  try {
    const author = await getDb().collection('authors').findOne({ _id: new ObjectId(id) });
    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.status(200).json(author);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching author', error: e.message });
  }
}

async function createAuthor(req, res) {
  const errors = validate(authorSchema, req.body);
  if (errors) return res.status(400).json({ message: 'Validation failed', errors });
  try {
    const result = await getDb().collection('authors').insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (e) {
    res.status(500).json({ message: 'Error creating author', error: e.message });
  }
}

async function updateAuthor(req, res) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid author ID' });
  const errors = validate(authorSchema, req.body);
  if (errors) return res.status(400).json({ message: 'Validation failed', errors });
  try {
    const result = await getDb().collection('authors').updateOne({ _id: new ObjectId(id) }, { $set: req.body });
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Author not found' });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: 'Error updating author', error: e.message });
  }
}

async function deleteAuthor(req, res) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid author ID' });
  try {
    const result = await getDb().collection('authors').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Author not found' });
    res.status(200).json({ message: 'Author deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Error deleting author', error: e.message });
  }
}

module.exports = { listAuthors, getAuthor, createAuthor, updateAuthor, deleteAuthor };
