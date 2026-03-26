var db = require('./db.js');

const query = (sql, params) => new Promise((resolve, reject) => {
  db.query(sql, params, (err, results) => {
    if (err) return reject(err);
    resolve(results);
  });
});

module.exports = {
  read: async (id) => {
    const results = await query('SELECT * FROM recruteur WHERE idRecruteur = ?', [id]);
    return results.length > 0 ? results[0] : null;
  },

  readAll: async () => {
    return query('SELECT * FROM recruteur', []);
  },

  create: async (data) => {
    const result = await query('INSERT INTO recruteur SET ?', data);
    return Object.assign({ insertId: result.insertId }, data);
  },

  update: async (id, data) => {
    const result = await query('UPDATE recruteur SET ? WHERE idRecruteur = ?', [data, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM recruteur WHERE idRecruteur = ?', [id]);
    return result.affectedRows;
  }
};
