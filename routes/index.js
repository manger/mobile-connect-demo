var express = require('express');
var router = express.Router();
var request = require('request');
var URL = require('url');
var util = require('./utils');
module.exports = router;

router.get('/', function(req, res) {
  // redirect any http request to https. In a real app, you'd probably want this in some middleware
  if(req.header('x-forwarded-proto') === 'https' || req.headers.host.indexOf('localhost') >= 0) {
    res.render('index', util.model(req, 'Telstra Mobile Connect Demo'));
  } else {
    res.redirect(301, "https://" + req.headers.host + req.originalUrl);
  }

});

router.get('/login', function(req, res) {
  res.render('login', util.model(req, 'Social Login'));
});

router.get('/logout', function(req, res) {
  delete req.session.user;
  res.redirect('/');
});

router.get('/about', function(req, res) {
  res.render('about', util.model(req, 'About'));
});

