const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  APP_WIDGET_URL: process.env.APP_WIDGET_URL,
  APP_SDK_URL: process.env.APP_SDK_URL,
};
