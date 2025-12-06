const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');
const { validate, userSchema } = require('../validation/schemas');

// GET all users
async function listUsers(req, res) {
  try {
    const db = getDb();
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users', details: error.message });
  }
}

// GET user by ID
async function getUser(req, res) {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    
    const db = getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user', details: error.message });
  }
}

// POST create user
async function createUser(req, res) {
  try {
    const validation = validate(userSchema, req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }
    
    const db = getDb();
    
    // Check if email already exists
    const existingUser = await db.collection('users').findOne({ email: validation.value.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    const userData = {
      ...validation.value,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(userData);
    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
}

// PUT update user
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    
    const validation = validate(userSchema, req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }
    
    const db = getDb();
    
    // Check if email is being changed to one that already exists
    if (validation.value.email) {
      const existingUser = await db.collection('users').findOne({
        email: validation.value.email,
        _id: { $ne: new ObjectId(id) }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    
    const updateData = {
      ...validation.value,
      updatedAt: new Date()
    };
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
}

// DELETE user
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    
    const db = getDb();
    
    // Check if user has associated recipes
    const recipeCount = await db.collection('recipes').countDocuments({ authorId: new ObjectId(id) });
    
    if (recipeCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete user with existing recipes',
        details: `User has ${recipeCount} recipe(s). Delete recipes first.`
      });
    }
    
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
}

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};
