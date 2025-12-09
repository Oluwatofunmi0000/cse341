const request = require('supertest');
const express = require('express');
const usersRouter = require('../routes/users');

// Mock the database
jest.mock('../config/db', () => ({
  getDb: jest.fn(() => ({
    collection: jest.fn(() => ({
      find: jest.fn(() => ({
        toArray: jest.fn(() => Promise.resolve([
          { _id: '507f1f77bcf86cd799439011', email: 'test@example.com', displayName: 'Test User' }
        ]))
      })),
      findOne: jest.fn((query) => {
        if (query._id) {
          return Promise.resolve({ 
            _id: '507f1f77bcf86cd799439011', 
            email: 'test@example.com', 
            displayName: 'Test User' 
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
app.use('/users', usersRouter);

describe('Users API - GET Endpoints', () => {
  test('GET /users - should return all users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /users - should return users with correct properties', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('email');
    expect(response.body[0]).toHaveProperty('displayName');
  });

  test('GET /users/:id - should return a single user', async () => {
    const response = await request(app).get('/users/507f1f77bcf86cd799439011');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.email).toBe('test@example.com');
  });

  test('GET /users/:id - should return 400 for invalid ID format', async () => {
    const response = await request(app).get('/users/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
