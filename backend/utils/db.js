const pool = require('../config/database');

/**
 * Execute a query with optional parameters.
 * @param {string} query - The SQL query string.
 * @param {Array} params - The parameters for the query.
 * @returns {Promise<Object>} - The result of the query.
 */
async function executeQuery(query, params = []) {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

module.exports = {
    executeQuery,
};
