const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');
const { validate, recipeSchema } = require('../validation/schemas');

// GET all recipes
async function listRecipes(req, res) {
  try {
    const db = getDb();
    const recipes = await db.collection('recipes').find().toArray();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recipes', details: error.message });
  }
}

// GET recipe by ID
async function getRecipe(req, res) {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid recipe ID format' });
    }
    
    const db = getDb();
    const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(id) });
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recipe', details: error.message });
  }
}

// POST create recipe
async function createRecipe(req, res) {
  try {
    const validation = validate(recipeSchema, req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }
    
    const db = getDb();
    
    // Verify author exists
    const author = await db.collection('users').findOne({ _id: new ObjectId(validation.value.authorId) });
    
    if (!author) {
      return res.status(400).json({ error: 'Author not found. Please provide a valid user ID.' });
    }
    
    const recipeData = {
      ...validation.value,
      authorId: new ObjectId(validation.value.authorId),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('recipes').insertOne(recipeData);
    res.status(201).json({
      message: 'Recipe created successfully',
      recipeId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create recipe', details: error.message });
  }
}

// PUT update recipe
async function updateRecipe(req, res) {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid recipe ID format' });
    }
    
    const validation = validate(recipeSchema, req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }
    
    const db = getDb();
    
    // Verify author exists if authorId is being updated
    if (validation.value.authorId) {
      const author = await db.collection('users').findOne({ _id: new ObjectId(validation.value.authorId) });
      
      if (!author) {
        return res.status(400).json({ error: 'Author not found. Please provide a valid user ID.' });
      }
    }
    
    const updateData = {
      ...validation.value,
      authorId: new ObjectId(validation.value.authorId),
      updatedAt: new Date()
    };
    
    const result = await db.collection('recipes').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json({ message: 'Recipe updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update recipe', details: error.message });
  }
}

// DELETE recipe
async function deleteRecipe(req, res) {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid recipe ID format' });
    }
    
    const db = getDb();
    const result = await db.collection('recipes').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recipe', details: error.message });
  }
}

module.exports = {
  listRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe
};
