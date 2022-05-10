const Validator = require('validator');
const validText = require('../valid-text');

module.exports = function validateUpdateHandle(data) {
  let errors = {};

  data.handle = validText(data.handle) ? data.handle : '';

  if (!Validator.isLength(data.handle, { min: 2, max: 30 })) {
    errors.handle = 'Handle must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'Handle field is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};