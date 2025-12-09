const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');
const { validate, mealPlanSchema } = require('../validation/schemas');

// GET all meal plans
async function listMealPlans(req, res) {
  try {
    const db = getDb();
    const mealPlans = await db.collection('mealPlans').find().toArray();
    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve meal plans', details: error.message });
  }
}

// GET meal plan by ID
async function getMealPlan(req, res) {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid meal plan ID format' });
    }
    
    const db = getDb();
    const mealPlan = await db.collection('mealPlans').findOne({ _id: new ObjectId(id) });
    
    if (!mealPlan) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }
    
    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve meal plan', details: error.message });
  }
}

// POST create meal plan
async function createMealPlan(req, res) {
  try {
    const validation = validate(mealPlanSchema, req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }
    
    const db = getDb();
    
    // Verify user exists
    const user = await db.collection('users').findOne({ _id: new ObjectId(validation.value.userId) });
    if (!user) {
      return res.status(400).json({ error: 'User not found. Please provide a valid user ID.' });
    }
    
    // Verify all recipes exist
    for (const meal of validation.value.meals) {
      const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(meal.recipeId) });
      if (!recipe) {
        return res.status(400).json({ error: `Recipe not found: ${meal.recipeId}` });
      }
    }
    
    const mealPlanData = {
      ...validation.value,
      userId: new ObjectId(validation.value.userId),
      meals: validation.value.meals.map(meal => ({
        ...meal,
        recipeId: new ObjectId(meal.recipeId)
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('mealPlans').insertOne(mealPlanData);
    res.status(201).json({
      message: 'Meal plan created successfully',
      mealPlanId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meal plan', details: error.message });
  }
}

// PUT update meal plan
async function updateMealPlan(req, res) {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid meal plan ID format' });
    }
    
    const validation = validate(mealPlanSchema, req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }
    
    const db = getDb();
    
    // Verify user exists
    const user = await db.collection('users').findOne({ _id: new ObjectId(validation.value.userId) });
    if (!user) {
      return res.status(400).json({ error: 'User not found. Please provide a valid user ID.' });
    }
    
    // Verify all recipes exist
    for (const meal of validation.value.meals) {
      const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(meal.recipeId) });
      if (!recipe) {
        return res.status(400).json({ error: `Recipe not found: ${meal.recipeId}` });
      }
    }
    
    const updateData = {
      ...validation.value,
      userId: new ObjectId(validation.value.userId),
      meals: validation.value.meals.map(meal => ({
        ...meal,
        recipeId: new ObjectId(meal.recipeId)
      })),
      updatedAt: new Date()
    };
    
    const result = await db.collection('mealPlans').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }
    
    res.json({ message: 'Meal plan updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meal plan', details: error.message });
  }
}

// DELETE meal plan
async function deleteMealPlan(req, res) {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid meal plan ID format' });
    }
    
    const db = getDb();
    const result = await db.collection('mealPlans').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }
    
    res.json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete meal plan', details: error.message });
  }
}

module.exports = {
  listMealPlans,
  getMealPlan,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan
};
