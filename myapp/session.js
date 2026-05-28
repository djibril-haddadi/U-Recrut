var sessions = require('express-session');

module.exports = {
  init: () => {
    return sessions({
      secret: 'xxxzzzyyyaaabbbcc',
      saveUninitialized: true,
      cookie: { maxAge: 3600 * 1000 }, // 60 minutes
      resave: false
    });
  },

  creatSession: function (session, mail, role) {
    session.userid = mail;
    session.role = role;
    session.save(function (err) {
      console.log(err);
    });
    return session;
  },

  isConnected: (session, role) => {
    if (!session.userid || session.userid === undefined) return false;
    if (role && session.role !== role) return false;
    return true;
  },

  deleteSession: function (session) {
    session.destroy();
  },

  attachUserLocals: function (req, res, next) {
    res.locals.user = req.session && req.session.user ? req.session.user : null;
    next();
  }
};