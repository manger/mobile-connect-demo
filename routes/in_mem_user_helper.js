module.exports = (function() {

    var Q = require('q');

    var users = {};

    var promiseToFindOrCreateUser = function(id) {
        return Q.promise(function(resolve, reject) {
            var profile = users[id];
            if(profile) {
                resolve(profile);
            } else {
                var newProfile = { id:id };
                users[id] = newProfile;
                resolve(newProfile);
            }
        });
    };

    var promiseToUpdateUser = function(id, user) {
        return Q.promise(function(resolve, reject) {
            users[id] = user;
            resolve({status:"ok"});
        });
    };

    return {
        promiseToFindOrCreateUser: promiseToFindOrCreateUser,
        promiseToUpdateUser: promiseToUpdateUser
    };
})();
