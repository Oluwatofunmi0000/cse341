const Joi = require('joi');

// User validation schema
const userSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Must be a valid email address',
      'any.required': 'Email is required'
    }),
  displayName: Joi.string().min(2).max(60).required()
    .messages({
      'string.min': 'Display name must be at least 2 characters',
      'string.max': 'Display name cannot exceed 60 characters',
      'any.required': 'Display name is required'
    }),
  googleId: Joi.string().optional(),
  dietaryPreferences: Joi.array().items(Joi.string().min(2).max(30)).optional()
    .messages({
      'array.base': 'Dietary preferences must be an array'
    })
});

// Recipe validation schema
const recipeSchema = Joi.object({
  title: Joi.string().min(3).max(100).required()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string().min(10).max(500).required()
    .messages({
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description cannot exceed 500 characters',
      'any.required': 'Description is required'
    }),
  ingredients: Joi.array().items(Joi.string().min(1).max(200)).min(1).max(30).required()
    .messages({
      'array.min': 'At least 1 ingredient is required',
      'array.max': 'Cannot exceed 30 ingredients',
      'any.required': 'Ingredients are required'
    }),
  instructions: Joi.array().items(Joi.string().min(5).max(500)).min(1).max(20).required()
    .messages({
      'array.min': 'At least 1 instruction step is required',
      'array.max': 'Cannot exceed 20 instruction steps',
      'any.required': 'Instructions are required'
    }),
  prepTime: Joi.number().integer().min(1).max(300).required()
    .messages({
      'number.min': 'Prep time must be at least 1 minute',
      'number.max': 'Prep time cannot exceed 300 minutes',
      'any.required': 'Prep time is required'
    }),
  cookTime: Joi.number().integer().min(1).max(600).required()
    .messages({
      'number.min': 'Cook time must be at least 1 minute',
      'number.max': 'Cook time cannot exceed 600 minutes',
      'any.required': 'Cook time is required'
    }),
  servingSize: Joi.number().integer().min(1).max(20).required()
    .messages({
      'number.min': 'Serving size must be at least 1',
      'number.max': 'Serving size cannot exceed 20',
      'any.required': 'Serving size is required'
    }),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').required()
    .messages({
      'any.only': 'Difficulty must be Easy, Medium, or Hard',
      'any.required': 'Difficulty is required'
    }),
  cuisine: Joi.string().min(2).max(30).required()
    .messages({
      'string.min': 'Cuisine must be at least 2 characters',
      'string.max': 'Cuisine cannot exceed 30 characters',
      'any.required': 'Cuisine is required'
    }),
  tags: Joi.array().items(Joi.string().min(2).max(30)).optional(),
  authorId: Joi.string().length(24).hex().required()
    .messages({
      'string.length': 'Author ID must be a valid MongoDB ObjectId',
      'any.required': 'Author ID is required'
    })
});

// Meal Plan validation schema
const mealPlanSchema = Joi.object({
  userId: Joi.string().length(24).hex().required()
    .messages({
      'string.length': 'User ID must be a valid MongoDB ObjectId',
      'any.required': 'User ID is required'
    }),
  name: Joi.string().min(3).max(100).required()
    .messages({
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
  startDate: Joi.date().iso().required()
    .messages({
      'date.base': 'Start date must be a valid date',
      'any.required': 'Start date is required'
    }),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required()
    .messages({
      'date.base': 'End date must be a valid date',
      'date.greater': 'End date must be after start date',
      'any.required': 'End date is required'
    }),
  meals: Joi.array().items(
    Joi.object({
      day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
      mealType: Joi.string().valid('Breakfast', 'Lunch', 'Dinner', 'Snack').required(),
      recipeId: Joi.string().length(24).hex().required()
    })
  ).min(1).max(50).required()
    .messages({
      'array.min': 'At least 1 meal is required',
      'array.max': 'Cannot exceed 50 meals',
      'any.required': 'Meals are required'
    }),
  notes: Joi.string().max(500).optional()
    .messages({
      'string.max': 'Notes cannot exceed 500 characters'
    })
});

// Grocery List validation schema
const groceryListSchema = Joi.object({
  userId: Joi.string().length(24).hex().required()
    .messages({
      'string.length': 'User ID must be a valid MongoDB ObjectId',
      'any.required': 'User ID is required'
    }),
  mealPlanId: Joi.string().length(24).hex().optional()
    .messages({
      'string.length': 'Meal Plan ID must be a valid MongoDB ObjectId'
    }),
  name: Joi.string().min(3).max(100).required()
    .messages({
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
  items: Joi.array().items(
    Joi.object({
      name: Joi.string().min(1).max(100).required(),
      quantity: Joi.string().min(1).max(50).required(),
      category: Joi.string().valid('Produce', 'Dairy', 'Meat', 'Bakery', 'Pantry', 'Frozen', 'Other').optional(),
      checked: Joi.boolean().optional()
    })
  ).min(1).max(100).required()
    .messages({
      'array.min': 'At least 1 item is required',
      'array.max': 'Cannot exceed 100 items',
      'any.required': 'Items are required'
    }),
  createdDate: Joi.date().iso().optional()
});

// Validation helper function
function validate(schema, data) {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    return {
      isValid: false,
      errors: error.details.map(detail => detail.message)
    };
  }
  return { isValid: true, value };
}

module.exports = {
  userSchema,
  recipeSchema,
  mealPlanSchema,
  groceryListSchema,
  validate
};
