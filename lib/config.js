const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const DEFAULT_SITE_URL = 'http://localhost:3001';

module.exports = {
    SITE_URL: process.env.SITE_URL || DEFAULT_SITE_URL,
};
