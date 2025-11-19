const Joi = require('joi');

const currentYear = new Date().getFullYear();

const authorSchema = Joi.object({
  firstName: Joi.string().min(2).max(60).required(),
  lastName: Joi.string().min(2).max(60).required(),
  email: Joi.string().email().required(),
  country: Joi.string().min(2).max(60).required(),
  birthDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
});

const bookSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  isbn: Joi.string().min(10).max(17).required(),
  authorId: Joi.string().length(24).hex().required(),
  publishedYear: Joi.number().integer().min(1450).max(currentYear).required(),
  genres: Joi.array().items(Joi.string().min(2).max(30)).min(1).max(5).required(),
  pages: Joi.number().integer().min(1).max(10000).required(),
  language: Joi.string().min(2).max(30).required(),
  inPrint: Joi.boolean().required(),
});

function validate(schema, payload) {
  const { error, value } = schema.validate(payload, { abortEarly: false });
  if (error) {
    return error.details.map(d => d.message);
  }
  return null;
}

module.exports = { authorSchema, bookSchema, validate };
