var db = require('./db.js');

const query = (sql, params) => new Promise((resolve, reject) => {
  db.query(sql, params, (err, results) => {
    if (err) return reject(err);
    resolve(results);
  });
});

module.exports = {
  read: async (id) => {
    const results = await query('SELECT * FROM document_candidature WHERE idDocument = ?', [id]);
    return results.length > 0 ? results[0] : null;
  },

  readByCandidatureId: async (idCandidature) => {
    const results = await query('SELECT * FROM document_candidature WHERE idCandidature = ?', [idCandidature]);
    return results.length > 0 ? results[0] : null;
  },

  readAll: async () => {
    return query('SELECT * FROM document_candidature', []);
  },

  create: async (data) => {
    const result = await query('INSERT INTO document_candidature SET ?', data);
    return Object.assign({ insertId: result.insertId }, data);
  },

  update: async (id, data) => {
    const result = await query('UPDATE document_candidature SET ? WHERE idDocument = ?', [data, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM document_candidature WHERE idDocument = ?', [id]);
    return result.affectedRows;
  }
};
