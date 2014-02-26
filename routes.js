
//mci.js / routes

var _             = require('underscore'),
    path          = require('path'),
    passport      = require('passport'),
    flash         = require('connect-flash'),
    user          = require('./user.js');

module.exports = function(app) {

  app.get('/auth/google', passport.authenticate('google'));

  app.get('/auth/google/return', passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
  }));
  
  app.get('/auth/logout', function(req, res){
    req.logout();
    res.redirect("/");
  });

  app.get('/home', ensureAuthenticated , function(req, res){
    res.render('home', { message: "welcome home"});
  });

  app.get('/', function(req, res){
    if (req.isAuthenticated()) { 
      res.redirect('/home');
    }
    res.render('login', { message: req.flash('error')  });
  });
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}