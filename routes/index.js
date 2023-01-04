
module.exports = function (router, passport) {
  const HomeRouter = require("./HomeRouter");
  const PostRouter = require("./PostRouter");
  const UserRouter = require("./UserRouter")(passport);
  //
  router.use('/', HomeRouter);
  router.use('/', UserRouter);
  router.use('/', PostRouter);
}

