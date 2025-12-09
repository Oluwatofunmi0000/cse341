const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');
const { validate, groceryListSchema } = require('../validation/schemas');

// GET all grocery lists
async function listGroceryLists(req, res) {
  try {
    const db = getDb();
    const groceryLists = await db.collection('groceryLists').find().toArray();
    res.json(groceryLists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve grocery lists', details: error.message });
  }
}

// GET grocery list by ID
async function getGroceryList(req, res) {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid grocery list ID format' });
    }
    
    const db = getDb();
    const groceryList = await db.collection('groceryLists').findOne({ _id: new ObjectId(id) });
    
    if (!groceryList) {
      return res.status(404).json({ error: 'Grocery list not found' });
    }
    
    res.json(groceryList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve grocery list', details: error.message });
  }
}

// POST create grocery list
async function createGroceryList(req, res) {
  try {
    const validation = validate(groceryListSchema, req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }
    
    const db = getDb();
    
    // Verify user exists
    const user = await db.collection('users').findOne({ _id: new ObjectId(validation.value.userId) });
    if (!user) {
      return res.status(400).json({ error: 'User not found. Please provide a valid user ID.' });
    }
    
    // Verify meal plan exists if provided
    if (validation.value.mealPlanId) {
      const mealPlan = await db.collection('mealPlans').findOne({ _id: new ObjectId(validation.value.mealPlanId) });
      if (!mealPlan) {
        return res.status(400).json({ error: 'Meal plan not found. Please provide a valid meal plan ID.' });
      }
    }
    
    const groceryListData = {
      ...validation.value,
      userId: new ObjectId(validation.value.userId),
      mealPlanId: validation.value.mealPlanId ? new ObjectId(validation.value.mealPlanId) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('groceryLists').insertOne(groceryListData);
    res.status(201).json({
      message: 'Grocery list created successfully',
      groceryListId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create grocery list', details: error.message });
  }
}

// PUT update grocery list
async function updateGroceryList(req, res) {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid grocery list ID format' });
    }
    
    const validation = validate(groceryListSchema, req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }
    
    const db = getDb();
    
    // Verify user exists
    const user = await db.collection('users').findOne({ _id: new ObjectId(validation.value.userId) });
    if (!user) {
      return res.status(400).json({ error: 'User not found. Please provide a valid user ID.' });
    }
    
    // Verify meal plan exists if provided
    if (validation.value.mealPlanId) {
      const mealPlan = await db.collection('mealPlans').findOne({ _id: new ObjectId(validation.value.mealPlanId) });
      if (!mealPlan) {
        return res.status(400).json({ error: 'Meal plan not found. Please provide a valid meal plan ID.' });
      }
    }
    
    const updateData = {
      ...validation.value,
      userId: new ObjectId(validation.value.userId),
      mealPlanId: validation.value.mealPlanId ? new ObjectId(validation.value.mealPlanId) : null,
      updatedAt: new Date()
    };
    
    const result = await db.collection('groceryLists').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Grocery list not found' });
    }
    
    res.json({ message: 'Grocery list updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update grocery list', details: error.message });
  }
}

// DELETE grocery list
async function deleteGroceryList(req, res) {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid grocery list ID format' });
    }
    
    const db = getDb();
    const result = await db.collection('groceryLists').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Grocery list not found' });
    }
    
    res.json({ message: 'Grocery list deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete grocery list', details: error.message });
  }
}

module.exports = {
  listGroceryLists,
  getGroceryList,
  createGroceryList,
  updateGroceryList,
  deleteGroceryList
};
