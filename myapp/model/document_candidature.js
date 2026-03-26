var db = require('./db.js');

module.exports = {
  read: function(id, callback) {
    db.query('SELECT * FROM document_candidature WHERE idDocument = ?', id, function(err, results) {
      if (err) throw err;
      callback(results.length > 0 ? results[0] : null);
    });
  },
  readAll: function(callback) {
    db.query('SELECT * FROM document_candidature', function(err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  create: function(data, callback) {
    db.query('INSERT INTO document_candidature SET ?', data, function(err, result) {
      if (err) throw err;
      callback(Object.assign({insertId: result.insertId}, data));
    });
  },
  update: function(id, data, callback) {
    db.query('UPDATE document_candidature SET ? WHERE idDocument = ?', [data, id], function(err, result) {
      if (err) throw err;
      callback(result.affectedRows);
    });
  },
  delete: function(id, callback) {
    db.query('DELETE FROM document_candidature WHERE idDocument = ?', id, function(err, result) {
      if (err) throw err;
      callback(result.affectedRows);
    });
  }
};
