module.exports = (function() {

    var Q = require('q');

    var users = {};

    var promiseToFindOrCreateUser = function(id) {
        return Q.promise(function(resolve, reject) {
            var data = users[id];
            if(data.exists()) {
                resolve(data);
            } else {
                var profile = { id:id };
                users[id] = profile;
                resolve(profile);
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
