var db = require('./db.js');

const query = (sql, params) => new Promise((resolve, reject) => {
  db.query(sql, params, (err, results) => {
    if (err) return reject(err);
    resolve(results);
  });
});

module.exports = {
  read: async (id) => {
    const results = await query('SELECT * FROM utilisateur WHERE idUtilisateur = ?', [id]);
    return results.length > 0 ? results[0] : null;
  },

  readAll: async () => {
    return query('SELECT * FROM utilisateur', []);
  },

  create: async (data) => {
    const result = await query('INSERT INTO utilisateur SET ?', data);
    return Object.assign({ insertId: result.insertId }, data);
  },

  update: async (id, data) => {
    const result = await query('UPDATE utilisateur SET ? WHERE idUtilisateur = ?', [data, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM utilisateur WHERE idUtilisateur = ?', [id]);
    return result.affectedRows;
  }
};
