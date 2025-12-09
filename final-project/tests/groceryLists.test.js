const request = require('supertest');
const express = require('express');
const groceryListsRouter = require('../routes/groceryLists');

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
            name: 'Test Grocery List',
            items: [
              { name: 'Milk', quantity: '2 gallons', category: 'Dairy', checked: false }
            ]
          }
        ]))
      })),
      findOne: jest.fn((query) => {
        if (query._id) {
          return Promise.resolve({ 
            _id: '507f1f77bcf86cd799439011', 
            name: 'Test Grocery List',
            items: []
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
app.use('/grocery-lists', groceryListsRouter);

describe('Grocery Lists API - GET Endpoints', () => {
  test('GET /grocery-lists - should return all grocery lists', async () => {
    const response = await request(app).get('/grocery-lists');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /grocery-lists - should return grocery lists with required fields', async () => {
    const response = await request(app).get('/grocery-lists');
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('items');
    expect(response.body[0]).toHaveProperty('userId');
  });

  test('GET /grocery-lists/:id - should return a single grocery list', async () => {
    const response = await request(app).get('/grocery-lists/507f1f77bcf86cd799439011');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe('Test Grocery List');
  });

  test('GET /grocery-lists/:id - should return 400 for invalid ID format', async () => {
    const response = await request(app).get('/grocery-lists/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
