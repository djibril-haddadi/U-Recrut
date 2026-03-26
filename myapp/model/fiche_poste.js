var db = require('./db.js');

module.exports = {
  read: function(id, callback) {
    db.query('SELECT * FROM fiche_poste WHERE idFichePoste = ?', id, function(err, results) {
      if (err) throw err;
      callback(results.length > 0 ? results[0] : null);
    });
  },
  readAll: function(callback) {
    db.query('SELECT * FROM fiche_poste', function(err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  create: function(data, callback) {
    db.query('INSERT INTO fiche_poste SET ?', data, function(err, result) {
      if (err) throw err;
      callback(Object.assign({insertId: result.insertId}, data));
    });
  },
  update: function(id, data, callback) {
    db.query('UPDATE fiche_poste SET ? WHERE idFichePoste = ?', [data, id], function(err, result) {
      if (err) throw err;
      callback(result.affectedRows);
    });
  },
  delete: function(id, callback) {
    db.query('DELETE FROM fiche_poste WHERE idFichePoste = ?', id, function(err, result) {
      if (err) throw err;
      callback(result.affectedRows);
    });
  }
};
