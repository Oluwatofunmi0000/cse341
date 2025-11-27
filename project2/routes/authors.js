const express = require('express');
const router = express.Router();
const controller = require('../controllers/authorsController');
const { isAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: List all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Array of authors
 */
router.get('/', controller.listAuthors);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Get author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Author found }
 *       400: { description: Invalid ID }
 *       404: { description: Not found }
 */
router.get('/:id', controller.getAuthor);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create a new author (requires authentication)
 *     tags: [Authors]
 *     security:
 *       - googleAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               country: { type: string }
 *               birthDate: { type: string }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 */
router.post('/', isAuthenticated, controller.createAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Update an author (requires authentication)
 *     tags: [Authors]
 *     security:
 *       - googleAuth: []
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
 *       401: { description: Unauthorized }
 *       404: { description: Not found }
 */
router.put('/:id', isAuthenticated, controller.updateAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author (requires authentication)
 *     tags: [Authors]
 *     security:
 *       - googleAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 *       400: { description: Invalid ID }
 *       401: { description: Unauthorized }
 *       404: { description: Not found }
 */
router.delete('/:id', isAuthenticated, controller.deleteAuthor);

module.exports = router;
