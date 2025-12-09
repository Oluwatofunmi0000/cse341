const express = require('express');
const router = express.Router();
const mealPlansController = require('../controllers/mealPlansController');
const { isAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Meal Plans
 *   description: Meal planning endpoints
 */

/**
 * @swagger
 * /meal-plans:
 *   get:
 *     summary: Get all meal plans
 *     tags: [Meal Plans]
 *     responses:
 *       200:
 *         description: List of all meal plans
 *       500:
 *         description: Server error
 */
router.get('/', mealPlansController.listMealPlans);

/**
 * @swagger
 * /meal-plans/{id}:
 *   get:
 *     summary: Get meal plan by ID
 *     tags: [Meal Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The meal plan ID
 *     responses:
 *       200:
 *         description: Meal plan details
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Meal plan not found
 *       500:
 *         description: Server error
 */
router.get('/:id', mealPlansController.getMealPlan);

/**
 * @swagger
 * /meal-plans:
 *   post:
 *     summary: Create a new meal plan (OAuth protected)
 *     tags: [Meal Plans]
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
 *               - startDate
 *               - endDate
 *               - meals
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               name:
 *                 type: string
 *                 example: Weekly Meal Plan
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-09
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-15
 *               meals:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *                     mealType:
 *                       type: string
 *                       enum: [Breakfast, Lunch, Dinner, Snack]
 *                     recipeId:
 *                       type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Meal plan created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.post('/', isAuthenticated, mealPlansController.createMealPlan);

/**
 * @swagger
 * /meal-plans/{id}:
 *   put:
 *     summary: Update meal plan by ID (OAuth protected)
 *     tags: [Meal Plans]
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
 *         description: Meal plan updated successfully
 *       400:
 *         description: Validation error or invalid ID
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Meal plan not found
 *       500:
 *         description: Server error
 */
router.put('/:id', isAuthenticated, mealPlansController.updateMealPlan);

/**
 * @swagger
 * /meal-plans/{id}:
 *   delete:
 *     summary: Delete meal plan by ID
 *     tags: [Meal Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meal plan deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Meal plan not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', mealPlansController.deleteMealPlan);

module.exports = router;
