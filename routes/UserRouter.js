const express = require('express')
const router = express.Router();
const User = require('../models/User')

module.exports = function(passport) {
  router.get('/login', (req, res) => {
    // res.send('GET request to the homepage')
    res.render('login');
  })
  router.get('/signup', (req, res) => {
    // res.send('GET request to the homepage')
    res.render('signup', {message: req.flash("signupMessage")});
  })
  
  router.post('/login', function(req, res, next) {
    const { id, password } = req.body;

    passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: req.originalUrl,
      failureFlash: true,
    })(req, res, next);
    console.log('maybe after authenticate..')
  });
  router.post('/signup', function(req, res, next) {
    const { id, password } = req.body;

    if (!id || !password) {
      res.json({"err": "!id || !password"});
      return;
    }

    var user = new User(req.body);
    user.save((err, info) => {
      console.log(`in save(),, err: ${err}, info: ${info}`);
      if (!err) {
        // res.json({msg: "success"})
        req.login(info, (err) => {
          if (err) {
            console.log(`req.login,,,, err:${err} `);
            // res.json({"err": err})
            next(err);
          } else {
            res.redirect('/')
          }
        })
      } else {
        if (err.code == 11000) {
          req.flash('signupMessage', '중복된 아이디 입니다.')
        } else {
          req.flash('signupMessage', err.toString())
        }
        res.redirect(req.originalUrl);
      }
    })
  });

  router.get('/logout', function(req, res, next) {
    console.log("logout");
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/");
    });
  });


  router.get('/profile/:userId', function(req, res, next) {
    const {userId} = req.params
    User.findOne({id: userId}, (err, doc) => {
      if (err) {
        res.json(err);
      } else {
        res.render('profile', {user: doc, isLoggedIn: req.isAuthenticated(), userId: req.user?.id})
      }
    })    
  });

  return router;
};

