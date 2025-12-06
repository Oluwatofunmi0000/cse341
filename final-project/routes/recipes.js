const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Recipe management endpoints
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: List of all recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Server error
 */
router.get('/', recipesController.listRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Get recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe ID
 *     responses:
 *       200:
 *         description: Recipe details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
router.get('/:id', recipesController.getRecipe);

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - ingredients
 *               - instructions
 *               - prepTime
 *               - cookTime
 *               - servingSize
 *               - difficulty
 *               - cuisine
 *               - authorId
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Classic Margherita Pizza
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *                 example: A traditional Italian pizza with fresh tomatoes, mozzarella, and basil
 *               ingredients:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 30
 *                 items:
 *                   type: string
 *                 example: ["2 cups flour", "1 cup water", "1 tsp yeast", "200g mozzarella", "3 tomatoes"]
 *               instructions:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 20
 *                 items:
 *                   type: string
 *                 example: ["Mix flour, water, and yeast", "Let dough rise for 1 hour", "Roll out dough", "Add toppings", "Bake at 450°F for 15 minutes"]
 *               prepTime:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 300
 *                 example: 20
 *               cookTime:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 600
 *                 example: 15
 *               servingSize:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 20
 *                 example: 4
 *               difficulty:
 *                 type: string
 *                 enum: [Easy, Medium, Hard]
 *                 example: Medium
 *               cuisine:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 30
 *                 example: Italian
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["pizza", "vegetarian", "dinner"]
 *               authorId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *       400:
 *         description: Validation error or author not found
 *       500:
 *         description: Server error
 */
router.post('/', recipesController.createRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: Update recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - ingredients
 *               - instructions
 *               - prepTime
 *               - cookTime
 *               - servingSize
 *               - difficulty
 *               - cuisine
 *               - authorId
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *               ingredients:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 30
 *                 items:
 *                   type: string
 *               instructions:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 20
 *                 items:
 *                   type: string
 *               prepTime:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 300
 *               cookTime:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 600
 *               servingSize:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 20
 *               difficulty:
 *                 type: string
 *                 enum: [Easy, Medium, Hard]
 *               cuisine:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 30
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               authorId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *       400:
 *         description: Validation error or invalid ID
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
router.put('/:id', recipesController.updateRecipe);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Delete recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe ID
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', recipesController.deleteRecipe);

module.exports = router;
