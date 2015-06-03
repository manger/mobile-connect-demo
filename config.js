module.exports = (function() {

    var apiBase = process.env['API_BASE'];

    var connect = {
        apiKey: process.env['CONNECT_API_KEY'],
        apiSecret: process.env['CONNECT_API_SECRET'],
        redirectUri: process.env['CONNECT_REDIRECT_URI'],
        oauthScope: process.env['CONNECT_OAUTH_SCOPE']
    };

    var exchangeApiKey = process.env['MC_EXCHANGE_KEY'];
    var exchangeApiSecret = process.env['MC_EXCHANGE_SECRET'];
    var mobileConnect = {
        apiKey: process.env['MC_API_KEY'],
        exchangeBasicAuth: new Buffer(exchangeApiKey + ":" + exchangeApiSecret).toString('base64'),
        redirectUri: process.env['MC_REDIRECT_URI'],
        oauthScope: process.env['MC_OAUTH_SCOPE']
    };

    var firebase = {
        uri: process.env['FIREBASE_URI']
    };

    return {
        apiBase: apiBase,
        connect: connect,
        mobileConnect: mobileConnect,
        firebase: firebase
    };
})();