const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_WIDGET_URL: process.env.APP_SDAPP_WIDGET_URLK_URL,
  APP_SDK_URL: process.env.APP_SDK_URL,
};
