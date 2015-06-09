var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');
module.exports = router;


// authenticate with Mobile Connect API
router.get('/mobileconnect', function(req, res) {
    var acr_values = 2;
    var nonce = util.guid();
    var state = util.guid();
    res.redirect(config.apiBase + '/v1/mobileconnect/authorize?response_type=code&client_id=' + config.mobileConnect.apiKey + '&scope=' + config.mobileConnect.oauthScope + '&redirect_uri=' + config.mobileConnect.redirectUri + "&nonce=" + nonce + "&state=" + state + "&acr_values=" + acr_values);
});


// handle the callback from the identity provider - route to either Connect or Mobile Connect
router.get('/auth', function(req, res) {
    authCallback(req, res);
});

var authCallback = function(originalRequest, originalResponse) {
    var options = {
        uri: config.apiBase + '/v1/mobileconnect/token',
        headers: {
            "Authorization": "Basic " + config.mobileConnect.exchangeBasicAuth
        },
        qs: {
            grant_type: 'authorization_code',
            code: originalRequest.query.code,
            redirect_uri: config.mobileConnect.redirectUri
        }
    };

    request.get(options, function(error, response, body) { tokenCallback(error, response, body, originalResponse); } );
};

var tokenCallback = function(error, response, body, originalResponse)  {
    if(!error) {
        var options = {
            uri: config.apiBase + '/v1/mobileconnect/userinfo',
            headers: {
                "Authorization": "Bearer " + JSON.parse(body).access_token
            }
        };

        request.get(options, function(error, response, body) { userInfoCallback(error, response, body, originalResponse); } );
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

