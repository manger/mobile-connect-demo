//
// Log in to application using the Discovery API
//

var discoveryServiceUri   = "https://stage-exchange-test.apigee.net/telstra_group/v2/discovery";
var discoveryClientID     = "E6ZE9L8JVy43KNXmgquzX4MA1tsXrDoO";
var discoveryClientSecret = "UM2EUXlL62tNK2CTzNSyVXFCfonlu7C5";

// where to redirect to after the discovery call has returned. This redirection occurs in the login popup
var discoveryRedirectUri  = "https://mobile-connect.herokuapp.com/mobileconnect/discovered.html";

// where to redirect after successful authentication. This must match the URI provided during API provisioning
var authorisedRedirectUri = "https://mobile-connect.herokuapp.com/mobileconnect/authorised.html";


function startActiveDiscovery() {
    var encrypt  = "basic"; // how we are encrypting the MSISDN
    var msisdn   = null; // not know at this stage
    var mcc      = null; // optional - can set to '505' for Australia
    var mnc      = null; // optional - can set to '01' for Telstra

    getDiscoveryActive(discoveryServiceUri, discoveryClientID, discoveryClientSecret, encrypt, mcc, mnc, msisdn, null, discoveryRedirectUri, activeDiscoveryComplete);
}

function activeDiscoveryComplete(discoveryResult, status) {
    if (status == 200 && discoveryResult && !!discoveryResult.getResponse()) {
        if (discoveryResult.getResponse().getApiFunction('operatorid', 'authorization')) {
            runAuthorization(discoveryResult);
        }
    }
}

function runAuthorization(discoveryResult) {

    // this is the client_id (API key) to use for all calls returned by the Discovery API. It may be different
    // to the client ID you use in the initial discovery phase.
    var apiClientID = discoveryResult.getResponse().getClient_id();

    // this is the encrypted MSISDN for the user attempting to login
    var subscriberId = discoveryResult.getResponse().getSubscriber_id();

    // this is the authorisation call that will redirect back to the mobile carrier to authenticate
    var authorizationEndpoint = discoveryResult.getResponse().getApiFunction('operatorid', 'authorization');

    var prompt = 'login';
    var max_age = 3600;
    var acr_values = '2';
    var login_hint = subscriberId ? ("ENCR_MSISDN:" + subscriberId) : null;
    var authorizationOptions = new AuthorizationOptions('page', 'en', 'en', 'Enter MSISDN', login_hint, null);
    var state='State'+Math.random().toString(36);
    var nonce='Nonce'+Math.random().toString(36);

    authorize(authorizationEndpoint, apiClientID, 'openid profile', authorisedRedirectUri, 'code', state, nonce, prompt, max_age, acr_values, authorizationOptions, authorizationCallbackFunction);
}

function authorizationCallbackFunction(data) {
    var code  = data.code;
    var error = data.error;

    if (!error && code && (code.trim().length) > 0) {
        // authentication was successful!
        // Pass the authentication code to the back end so it can fetch the user details from the carrier
        window.location.href = "auth?code=" + code + "&scope=" + data.scope + "&state=" + data.state;
    } else if(error) {
        console.log("error logging in:", error);
    } else {
        // log in was cancelled. Can happen when user closes the popup.
    }
}