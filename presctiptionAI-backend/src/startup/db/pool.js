const { Pool } = require('pg');
const config = require('../../config/config');

const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();


const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PH_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

module.exports = pool;
