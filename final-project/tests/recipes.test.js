const request = require('supertest');
const express = require('express');
const recipesRouter = require('../routes/recipes');

// Mock the database
jest.mock('../config/db', () => ({
  getDb: jest.fn(() => ({
    collection: jest.fn(() => ({
      find: jest.fn(() => ({
        toArray: jest.fn(() => Promise.resolve([
          { 
            _id: '507f1f77bcf86cd799439011', 
            title: 'Test Recipe',
            description: 'A test recipe description',
            ingredients: ['ingredient 1'],
            instructions: ['step 1'],
            prepTime: 10,
            cookTime: 20,
            servingSize: 4,
            difficulty: 'Easy',
            cuisine: 'Test',
            authorId: '507f1f77bcf86cd799439012'
          }
        ]))
      })),
      findOne: jest.fn((query) => {
        if (query._id) {
          return Promise.resolve({ 
            _id: '507f1f77bcf86cd799439011', 
            title: 'Test Recipe',
            description: 'A test recipe description'
          });
        }
        return Promise.resolve(null);
      })
    }))
  }))
}));

// Create test app
const app = express();
app.use(express.json());
app.use('/recipes', recipesRouter);

describe('Recipes API - GET Endpoints', () => {
  test('GET /recipes - should return all recipes', async () => {
    const response = await request(app).get('/recipes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /recipes - should return recipes with required fields', async () => {
    const response = await request(app).get('/recipes');
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('title');
    expect(response.body[0]).toHaveProperty('ingredients');
    expect(response.body[0]).toHaveProperty('instructions');
  });

  test('GET /recipes/:id - should return a single recipe', async () => {
    const response = await request(app).get('/recipes/507f1f77bcf86cd799439011');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Test Recipe');
  });

  test('GET /recipes/:id - should return 400 for invalid ID format', async () => {
    const response = await request(app).get('/recipes/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
