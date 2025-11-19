const express = require('express');
const router = express.Router();
const controller = require('../controllers/booksController');

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: List all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Array of books
 */
router.get('/', controller.listBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Book found }
 *       400: { description: Invalid ID }
 *       404: { description: Not found }
 */
router.get('/:id', controller.getBook);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               isbn: { type: string }
 *               authorId: { type: string }
 *               publishedYear: { type: number }
 *               genres: { type: array, items: { type: string } }
 *               pages: { type: number }
 *               language: { type: string }
 *               inPrint: { type: boolean }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Validation error }
 */
router.post('/', controller.createBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       204: { description: Updated }
 *       400: { description: Validation/ID error }
 *       404: { description: Not found }
 */
router.put('/:id', controller.updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 *       400: { description: Invalid ID }
 *       404: { description: Not found }
 */
router.delete('/:id', controller.deleteBook);

module.exports = router;
