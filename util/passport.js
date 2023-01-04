var LocalStrategy    = require('passport-local').Strategy;
var User       = require('../models/User');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({ 'id' :  id }, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy(
        {
            usernameField : 'id',
            passwordField : 'password',
            passReqToCallback : true
        },
    function(req, id, password, done) {
        process.nextTick(function() {
            User.findOne({ 'id' :  id }, function(err, user) {
                if (err) {
                    return done(err);
                } else {
                    if (!user) {
                        return done(null, false, req.flash('loginMessage', '가입되지 않은 회원입니다.'));
                    } else {
                        if (user.password) {
                            if (!user.validPassword(password)) {
                                return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다.'));
                            } else {
                                return done(null, user);
                            }
                        } else {
                            return done(null, false, req.flash('loginMessage', 'Please check your email, and set your new password.'))
                        }
                    }
                }
            });
        });
    }));
};
