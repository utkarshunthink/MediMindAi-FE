const pool = require('../startup/db/pool');

// Create a new user
const createUser = async (userData) => {
    const { name, email, password } = userData;
    const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email;
    `;
    const result = await pool.query(query, [name, email, password]);
    return result.rows[0];
};

// Find a user by email
const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1;';
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

// Save password reset token and expiry
const savePasswordResetToken = async (userId, resetToken, tokenExpiry) => {
    const query = `UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3;`;
    await pool.query(query, [resetToken, tokenExpiry, userId]);
};

// Find user by reset token
const findUserByResetToken = async (resetToken) => {
    const query = `SELECT * FROM users WHERE reset_token = $1;`;
    const result = await pool.query(query, [resetToken]);
    return result.rows[0];
};

// Update user password
const updateUserPassword = async (userId, hashedPassword) => {
    const query = `UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2;`;

    await pool.query(query, [hashedPassword, userId]);
};

module.exports = {
    createUser,
    findUserByEmail,
    savePasswordResetToken,
    findUserByResetToken,
    updateUserPassword
};
