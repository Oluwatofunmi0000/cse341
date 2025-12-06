const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
router.get('/', usersController.listUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id', usersController.getUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - displayName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               displayName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 60
 *                 example: John Doe
 *               googleId:
 *                 type: string
 *                 example: 123456789
 *               dietaryPreferences:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["vegetarian", "gluten-free"]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or email already exists
 *       500:
 *         description: Server error
 */
router.post('/', usersController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - displayName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               displayName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 60
 *               googleId:
 *                 type: string
 *               dietaryPreferences:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error or invalid ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/:id', usersController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid ID or user has existing recipes
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', usersController.deleteUser);

module.exports = router;
