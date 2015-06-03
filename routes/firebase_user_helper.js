module.exports = (function() {

    var config = require('../config');
    var Firebase = require("firebase");
    var firebase = new Firebase(config.firebase.uri);
    var Q = require('q');

    var usersRef = firebase.child('users');

    var promiseToFindOrCreateUser = function(id) {
        return Q.promise(function(resolve, reject) {
            usersRef.child(id).on("value", function(data) {
                if(data.exists()) {
                    var profile = data.val();
                    resolve(profile);
                } else {
                    var profile = { id:id };
                    usersRef.child(id).set(profile);
                    resolve(profile);
                }
            });
        });
    };

    var promiseToUpdateUser = function(id, user) {
        return Q.promise(function(resolve, reject) {
            usersRef.child(id).set(user);
            resolve({status:"ok"});
        });
    };

    return {
        promiseToFindOrCreateUser: promiseToFindOrCreateUser,
        promiseToUpdateUser: promiseToUpdateUser
    };
})();
