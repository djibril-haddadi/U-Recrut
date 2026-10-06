var db = require('./db.js');

const query = (sql, params) => new Promise((resolve, reject) => {
  db.query(sql, params, (err, results) => {
    if (err) return reject(err);
    resolve(results);
  });
});

module.exports = {
  read: async (id) => {
    const results = await query('SELECT * FROM fiche_poste WHERE idFichePoste = ?', [id]);
    return results.length > 0 ? results[0] : null;
  },

  readAll: async () => {
    return query('SELECT * FROM fiche_poste', []);
  },

  create: async (data) => {
    const result = await query('INSERT INTO fiche_poste SET ?', data);
    return Object.assign({ insertId: result.insertId }, data);
  },

  update: async (id, data) => {
    const result = await query('UPDATE fiche_poste SET ? WHERE idFichePoste = ?', [data, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM fiche_poste WHERE idFichePoste = ?', [id]);
    return result.affectedRows;
  }
};
