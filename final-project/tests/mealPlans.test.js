const request = require('supertest');
const express = require('express');
const mealPlansRouter = require('../routes/mealPlans');

// Mock authentication middleware
jest.mock('../middleware/auth', () => ({
  isAuthenticated: (req, res, next) => next()
}));

// Mock the database
jest.mock('../config/db', () => ({
  getDb: jest.fn(() => ({
    collection: jest.fn(() => ({
      find: jest.fn(() => ({
        toArray: jest.fn(() => Promise.resolve([
          { 
            _id: '507f1f77bcf86cd799439011', 
            userId: '507f1f77bcf86cd799439012',
            name: 'Test Meal Plan',
            startDate: '2025-12-09',
            endDate: '2025-12-15',
            meals: [{ day: 'Monday', mealType: 'Lunch', recipeId: '507f1f77bcf86cd799439013' }]
          }
        ]))
      })),
      findOne: jest.fn((query) => {
        if (query._id) {
          return Promise.resolve({ 
            _id: '507f1f77bcf86cd799439011', 
            name: 'Test Meal Plan',
            meals: []
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
app.use('/meal-plans', mealPlansRouter);

describe('Meal Plans API - GET Endpoints', () => {
  test('GET /meal-plans - should return all meal plans', async () => {
    const response = await request(app).get('/meal-plans');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /meal-plans - should return meal plans with required fields', async () => {
    const response = await request(app).get('/meal-plans');
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('meals');
    expect(response.body[0]).toHaveProperty('userId');
  });

  test('GET /meal-plans/:id - should return a single meal plan', async () => {
    const response = await request(app).get('/meal-plans/507f1f77bcf86cd799439011');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe('Test Meal Plan');
  });

  test('GET /meal-plans/:id - should return 400 for invalid ID format', async () => {
    const response = await request(app).get('/meal-plans/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
