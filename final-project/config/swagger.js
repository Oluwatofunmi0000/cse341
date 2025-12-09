const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipe & Meal Planning API',
      version: '1.0.0',
      description: 'A comprehensive API for managing recipes, meal plans, and grocery lists',
      contact: {
        name: 'API Support',
        email: 'support@recipeapi.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://project1-pig7.onrender.com',
        description: 'Production server'
      }
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
                profile: 'Access user profile',
                email: 'Access user email'
              }
            }
          }
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'displayName'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ObjectId',
              example: '507f1f77bcf86cd799439011'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address (unique)',
              example: 'john.doe@example.com'
            },
            displayName: {
              type: 'string',
              minLength: 2,
              maxLength: 60,
              description: 'User display name',
              example: 'John Doe'
            },
            googleId: {
              type: 'string',
              description: 'Google OAuth ID',
              example: '123456789'
            },
            dietaryPreferences: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'User dietary preferences',
              example: ['vegetarian', 'gluten-free']
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Recipe: {
          type: 'object',
          required: [
            'title',
            'description',
            'ingredients',
            'instructions',
            'prepTime',
            'cookTime',
            'servingSize',
            'difficulty',
            'cuisine',
            'authorId'
          ],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ObjectId',
              example: '507f1f77bcf86cd799439011'
            },
            title: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Recipe title',
              example: 'Classic Margherita Pizza'
            },
            description: {
              type: 'string',
              minLength: 10,
              maxLength: 500,
              description: 'Recipe description',
              example: 'A traditional Italian pizza with fresh tomatoes, mozzarella, and basil'
            },
            ingredients: {
              type: 'array',
              minItems: 1,
              maxItems: 30,
              items: {
                type: 'string'
              },
              description: 'List of ingredients',
              example: ['2 cups flour', '1 cup water', '1 tsp yeast', '200g mozzarella', '3 tomatoes']
            },
            instructions: {
              type: 'array',
              minItems: 1,
              maxItems: 20,
              items: {
                type: 'string'
              },
              description: 'Step-by-step instructions',
              example: [
                'Mix flour, water, and yeast',
                'Let dough rise for 1 hour',
                'Roll out dough',
                'Add toppings',
                'Bake at 450°F for 15 minutes'
              ]
            },
            prepTime: {
              type: 'number',
              minimum: 1,
              maximum: 300,
              description: 'Preparation time in minutes',
              example: 20
            },
            cookTime: {
              type: 'number',
              minimum: 1,
              maximum: 600,
              description: 'Cooking time in minutes',
              example: 15
            },
            servingSize: {
              type: 'number',
              minimum: 1,
              maximum: 20,
              description: 'Number of servings',
              example: 4
            },
            difficulty: {
              type: 'string',
              enum: ['Easy', 'Medium', 'Hard'],
              description: 'Recipe difficulty level',
              example: 'Medium'
            },
            cuisine: {
              type: 'string',
              minLength: 2,
              maxLength: 30,
              description: 'Cuisine type',
              example: 'Italian'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Recipe tags',
              example: ['pizza', 'vegetarian', 'dinner']
            },
            authorId: {
              type: 'string',
              pattern: '^[0-9a-fA-F]{24}$',
              description: 'Reference to User who created the recipe',
              example: '507f1f77bcf86cd799439011'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Recipe creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        MealPlan: {
          type: 'object',
          required: ['userId', 'name', 'startDate', 'endDate', 'meals'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            userId: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              example: 'Weekly Meal Plan'
            },
            startDate: {
              type: 'string',
              format: 'date'
            },
            endDate: {
              type: 'string',
              format: 'date'
            },
            meals: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  day: {
                    type: 'string',
                    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                  },
                  mealType: {
                    type: 'string',
                    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack']
                  },
                  recipeId: {
                    type: 'string'
                  }
                }
              }
            },
            notes: {
              type: 'string'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        GroceryList: {
          type: 'object',
          required: ['userId', 'name', 'items'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            userId: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            mealPlanId: {
              type: 'string',
              example: '507f1f77bcf86cd799439012'
            },
            name: {
              type: 'string',
              example: 'Weekly Shopping List'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Milk'
                  },
                  quantity: {
                    type: 'string',
                    example: '2 gallons'
                  },
                  category: {
                    type: 'string',
                    enum: ['Produce', 'Dairy', 'Meat', 'Bakery', 'Pantry', 'Frozen', 'Other']
                  },
                  checked: {
                    type: 'boolean'
                  }
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
