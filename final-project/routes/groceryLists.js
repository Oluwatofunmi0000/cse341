const express = require('express');
const router = express.Router();
const groceryListsController = require('../controllers/groceryListsController');
const { isAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Grocery Lists
 *   description: Grocery list management endpoints
 */

/**
 * @swagger
 * /grocery-lists:
 *   get:
 *     summary: Get all grocery lists
 *     tags: [Grocery Lists]
 *     responses:
 *       200:
 *         description: List of all grocery lists
 *       500:
 *         description: Server error
 */
router.get('/', groceryListsController.listGroceryLists);

/**
 * @swagger
 * /grocery-lists/{id}:
 *   get:
 *     summary: Get grocery list by ID
 *     tags: [Grocery Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The grocery list ID
 *     responses:
 *       200:
 *         description: Grocery list details
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Grocery list not found
 *       500:
 *         description: Server error
 */
router.get('/:id', groceryListsController.getGroceryList);

/**
 * @swagger
 * /grocery-lists:
 *   post:
 *     summary: Create a new grocery list (OAuth protected)
 *     tags: [Grocery Lists]
 *     security:
 *       - googleAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - name
 *               - items
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               mealPlanId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *               name:
 *                 type: string
 *                 example: Weekly Shopping List
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Milk
 *                     quantity:
 *                       type: string
 *                       example: 2 gallons
 *                     category:
 *                       type: string
 *                       enum: [Produce, Dairy, Meat, Bakery, Pantry, Frozen, Other]
 *                     checked:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Grocery list created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.post('/', isAuthenticated, groceryListsController.createGroceryList);

/**
 * @swagger
 * /grocery-lists/{id}:
 *   put:
 *     summary: Update grocery list by ID (OAuth protected)
 *     tags: [Grocery Lists]
 *     security:
 *       - googleAuth: []
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
 *             type: object
 *     responses:
 *       200:
 *         description: Grocery list updated successfully
 *       400:
 *         description: Validation error or invalid ID
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Grocery list not found
 *       500:
 *         description: Server error
 */
router.put('/:id', isAuthenticated, groceryListsController.updateGroceryList);

/**
 * @swagger
 * /grocery-lists/{id}:
 *   delete:
 *     summary: Delete grocery list by ID
 *     tags: [Grocery Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Grocery list deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Grocery list not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', groceryListsController.deleteGroceryList);

module.exports = router;
