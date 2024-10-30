// backend/models/Admin.js
const { executeQuery } = require('../utils/db');

const Admin = {
  createAdmin: async (adminData) => {
    const { username, email, password } = adminData;
    const query = 'INSERT INTO admin_users (username, email, password) VALUES (?, ?, ?)';
    const result = await executeQuery(query, [username, email, password]);
    return result.insertId;
  },

  getAdminByEmail: async (email) => {
    const query = 'SELECT * FROM admin_users WHERE email = ?';
    const results = await executeQuery(query, [email]);
    return results[0];
  },

  getAdminById: async (id) => {
    const query = 'SELECT * FROM admin_users WHERE admin_id = ?';
    const results = await executeQuery(query, [id]);
    return results[0];
  }
};

module.exports = Admin;