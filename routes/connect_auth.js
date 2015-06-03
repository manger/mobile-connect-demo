var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');
module.exports = router;


// authenticate with Telstra Connect API
router.get('/openidconnect', function(req, res) {
    res.redirect(config.apiBase + '/v1/identity/authorize?response_type=code&client_id=' + config.connect.apiKey + '&scope=' + config.connect.oauthScope + '&redirect_uri=' + config.connect.redirectUri);
});


// handle the callback from the identity provider - route to either Connect or Mobile Connect
router.get('/connect_auth', function(req, res) {
    if(req.query.scope == config.connect.oauthScope) {
        authCallback(req, res);
    } else {
        res.status(400).send({ error:"no valid scope specified" });
    }
});

var authCallback = function(originalRequest, originalResponse) {
    var options = {
        uri: config.apiBase + '/v1/identity/token',
        qs: {
            grant_type: 'authorization_code',
            code: originalRequest.query.code,
            redirect_uri: config.connect.redirectUri,
            client_id: config.connect.apiKey,
            client_secret: config.connect.apiSecret
        }
    };

    request.get(options, function(error, response, body) { tokenCallback(error, response, body, originalResponse); });
};

var tokenCallback = function (error, response, body, originalResponse)  {
    if(!error) {
        var options = {
            uri: config.apiBase + '/v1/identity/userinfo',
            headers: {
                "Authorization": "Bearer " + JSON.parse(body).access_token
            }
        };

        request.get(options, function(error, response, body) { userInfoCallback(error, response, body, originalResponse); });
    } else {
        originalResponse.status(500).send({ message: "error fetching token", error: error, response: response, body:body });
    }
};

var userInfoCallback = function (error, response, body, originalResponse) {
    if(!error) {
        var userinfo = JSON.parse(body);
        originalResponse.req.session.userinfo = userinfo;
        originalResponse.redirect('/user/' + userinfo.sub + "?redirect=/private");
    } else {
        originalResponse.status(500).send({ message: "error fetching user info", error: error, response: response, body:body });
    }
};

