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
            firstName: { type: 'string', minLength: 1, example: 'Alice' },
            lastName: { type: 'string', minLength: 1, example: 'Smith' },
            email: { type: 'string', format: 'email', example: 'alice.smith@email.com' },
            favoriteColor: { type: 'string', enum: ['Red', 'Green', 'Blue', 'Yellow', 'Orange', 'Purple'] },
            birthday: { type: 'string', format: 'date', example: '1994-08-22' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
