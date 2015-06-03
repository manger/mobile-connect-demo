module.exports = (function() {

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    function model(req, title) {
        var user = req.session.user;
        var id = (user ? user.id : null);

        return {
            title: title,
            user: user,
            id: id
        };
    }

    return {
        guid: guid,
        model: model
    };
})();