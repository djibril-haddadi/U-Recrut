var db = require('./db.js');

module.exports = {
  read: function(id, callback) {
    db.query('SELECT * FROM organisation WHERE siren = ?', id, function(err, results) {
      if (err) throw err;
      callback(results.length > 0 ? results[0] : null);
    });
  },
  readAll: function(callback) {
    db.query('SELECT * FROM organisation', function(err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  create: function(data, callback) {
    db.query('INSERT INTO organisation SET ?', data, function(err, result) {
      if (err) throw err;
      callback(Object.assign({insertId: result.insertId}, data));
    });
  },
  update: function(id, data, callback) {
    db.query('UPDATE organisation SET ? WHERE siren = ?', [data, id], function(err, result) {
      if (err) throw err;
      callback(result.affectedRows);
    });
  },
  delete: function(id, callback) {
    db.query('DELETE FROM organisation WHERE siren = ?', id, function(err, result) {
      if (err) throw err;
      callback(result.affectedRows);
    });
  }
};
