const Validator = require('validator');
const validText = require('../valid-text');

module.exports = function validateUpdateAvatar(data) {
  let errors = {};

  data.avatar = validText(data.avatar) ? data.avatar : '';

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};