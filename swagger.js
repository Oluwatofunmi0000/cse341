const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'API for managing contacts (CSE341 W01/W02)'
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local' },
      { url: 'https://project1-pig7.onrender.com', description: 'Render' }
    ],
    components: {
      schemas: {
        Contact: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
          properties: {
            _id: { type: 'string', description: 'MongoDB ObjectId' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            favoriteColor: { type: 'string' },
            birthday: { type: 'string', example: '1990-05-15' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
