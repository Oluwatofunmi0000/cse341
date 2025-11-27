const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Project 2 API',
      version: '1.0.0',
      description: 'CRUD API for Authors and Books with OAuth Authentication'
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Local dev server' },
      { url: 'https://your-render-url.onrender.com', description: 'Production server' }
    ],
    components: {
      securitySchemes: {
        googleAuth: {
          type: 'oauth2',
          description: 'Google OAuth 2.0 authentication',
          flows: {
            authorizationCode: {
              authorizationUrl: '/auth/google',
              tokenUrl: '/auth/google/callback',
              scopes: {
                'profile': 'Access user profile',
                'email': 'Access user email'
              }
            }
          }
        }
      },
      schemas: {
        Author: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'country', 'birthDate'],
          properties: {
            _id: { type: 'string', description: 'MongoDB ObjectId' },
            firstName: { type: 'string', minLength: 2, maxLength: 60, example: 'Jane' },
            lastName: { type: 'string', minLength: 2, maxLength: 60, example: 'Austen' },
            email: { type: 'string', format: 'email', example: 'jane.austen@literature.com' },
            country: { type: 'string', minLength: 2, maxLength: 60, example: 'England' },
            birthDate: { type: 'string', format: 'date', example: '1775-12-16' }
          }
        },
        Book: {
          type: 'object',
          required: ['title', 'isbn', 'authorId', 'publishedYear', 'genres', 'pages', 'language', 'inPrint'],
          properties: {
            _id: { type: 'string', description: 'MongoDB ObjectId' },
            title: { type: 'string', minLength: 3, maxLength: 200, example: 'Pride and Prejudice' },
            isbn: { type: 'string', minLength: 10, maxLength: 17, example: '978-0-14-143951-8' },
            authorId: { type: 'string', description: 'ObjectId reference to an Author', example: '507f1f77bcf86cd799439011' },
            publishedYear: { type: 'integer', minimum: 1450, example: 1813 },
            genres: {
              type: 'array',
              minItems: 1,
              maxItems: 5,
              items: { type: 'string', minLength: 2, maxLength: 30 },
              example: ['Romance', 'Classic']
            },
            pages: { type: 'integer', minimum: 1, maximum: 10000, example: 432 },
            language: { type: 'string', minLength: 2, maxLength: 30, example: 'English' },
            inPrint: { type: 'boolean', example: true }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  },
  apis: [
    './routes/auth.js',
    './routes/authors.js',
    './routes/books.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = { setupSwagger };
