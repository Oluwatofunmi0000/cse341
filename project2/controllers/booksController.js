const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const { bookSchema, validate } = require('../validation/schemas');

async function listBooks(req, res) {
  try {
    const books = await getDb().collection('books').find().toArray();
    res.status(200).json(books);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching books', error: e.message });
  }
}

async function getBook(req, res) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid book ID' });
  try {
    const book = await getDb().collection('books').findOne({ _id: new ObjectId(id) });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching book', error: e.message });
  }
}

async function createBook(req, res) {
  const errors = validate(bookSchema, req.body);
  if (errors) return res.status(400).json({ message: 'Validation failed', errors });
  try {
    // Optionally verify author exists
    const authorId = req.body.authorId;
    const author = await getDb().collection('authors').findOne({ _id: new ObjectId(authorId) });
    if (!author) return res.status(400).json({ message: 'authorId does not reference an existing author' });

    const result = await getDb().collection('books').insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
  } catch (e) {
    res.status(500).json({ message: 'Error creating book', error: e.message });
  }
}

async function updateBook(req, res) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid book ID' });
  const errors = validate(bookSchema, req.body);
  if (errors) return res.status(400).json({ message: 'Validation failed', errors });
  try {
    const authorId = req.body.authorId;
    const author = await getDb().collection('authors').findOne({ _id: new ObjectId(authorId) });
    if (!author) return res.status(400).json({ message: 'authorId does not reference an existing author' });

    const result = await getDb().collection('books').updateOne({ _id: new ObjectId(id) }, { $set: req.body });
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Book not found' });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: 'Error updating book', error: e.message });
  }
}

async function deleteBook(req, res) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid book ID' });
  try {
    const result = await getDb().collection('books').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Error deleting book', error: e.message });
  }
}

module.exports = { listBooks, getBook, createBook, updateBook, deleteBook };
