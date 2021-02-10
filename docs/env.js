const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

module.exports = {
  APP_SDK_URL: process.env.APP_SDK_URL,
};
