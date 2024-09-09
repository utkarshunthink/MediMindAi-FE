const { Pool } = require('pg');
const config = require('../../config/config');

const pool = new Pool({
    user: config.pg.user,
    host: config.pg.localhost,
    database: config.pg.database,
    password: config.pg.password,
    port: config.pg.port,
});

module.exports = pool;
