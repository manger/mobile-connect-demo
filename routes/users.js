var express = require('express');
var router = express.Router();
var request = require('request');
var users = require('./in_mem_user_helper');
var util = require('./utils');
module.exports = router;

// load the user profile into the session
router.get('/user/:id', function(req, res, next) {
    console.log("fetching " + req.params.id);

    users.promiseToFindOrCreateUser(req.params.id).then(function(data) {
        req.session.user = data;

        // if profile not filled out, then redirect user there, otherwise, allow them to continue
        if(!data.name) {
            res.redirect('/user/' + req.params.id + "/edit");
        } else {
            if(req.query.redirect) {
                res.redirect(req.query.redirect);
            } else {
                res.redirect('/user/' + req.params.id + "/edit");
            }
        }
    });
});

router.get('/user/:id/edit', function(req, res, next) {
    res.render('profile', util.model(req, "User profile"));
});

router.post('/user/:id', function(req, res, next) {
    var id = req.params.id;
    users.promiseToUpdateUser(id, req.body).then(function() {
        res.redirect("/user/" + id + "?redirect=/private");
    }, function(err) {
        res.status(500).send(err);
    });
});

router.get('/private', function(req, res, next) {
    if(req.session && req.session.user) {
        res.render('private', util.model(req, "My Account"));
    } else {
        res.status(401).render('user_error', {
            title: "ERROR!",
            error: 'Unauthorised access',
            message: 'You must be logged in to view your account details',
            user: {}
        });
    }
});
