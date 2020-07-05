const envSettings = () => {
  require('dotenv').config();

  // Dotenv directives
  const dotenv = require('dotenv');
  const result = dotenv.config();

  // Handle dotenv errors if any
  if (result.error) {
    throw result.error;
  }
};

module.exports = envSettings;