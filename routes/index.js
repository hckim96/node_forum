const User = require('../models/User')

module.exports = function (router, passport) {
  const HomeRouter = require("./HomeRouter");
  const PostRouter = require("./PostRouter");
  const UserRouter = require("./UserRouter")(passport);
  const CommentRouter = require("./CommentRouter");
  //
  require('dotenv').config()
  // this is the setup for development
  if (process.env.LOCAL) {
    let setupDoneSet = new Set()
    router.get('/*', (req, res, next) => {
      const ip = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
      if (!setupDoneSet.has(ip)) {
        var loginId = "admin"
        if (!req.user) {
          console.log(`[SETUP]: login id: ${loginId}`);
          return autoLogin(loginId, req, res);
        }
        
        console.log(`[SETUP] redirect to: /profile/${loginId}`);
        setupDoneSet.add(ip);
        console.log('[SETUP] setupDoneSet :>> ', setupDoneSet);
        return res.redirect(`/profile/${loginId}`)
      }
      return next();
    })
  }

  router.use('/', HomeRouter);
  router.use('/', UserRouter);
  router.use('/', CommentRouter);
  router.use('/', PostRouter);
}


function autoLogin(loginId, req, res) {
  User.findOne({ id: loginId }, (err, doc) => {
    if (err) { console.log(`err: ${err}`); return; }
    if (!doc) { console.log(`no user for id ${loginId}`); return; }
    req.login(doc, (err2) => {
      if (err2) { console.log('err2 :>> ', err2); return; }
      console.log(`auto login for user ${loginId} succeeded`);
      return res.redirect('/');
    });
  });
}