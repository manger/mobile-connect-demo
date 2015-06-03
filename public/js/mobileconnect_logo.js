//
// Loading the Mobile Connect logo via the Logo API
//

var logoServiceUri = "https://stage-exchange-test.apigee.net/logo/v1";
var logoSize = "small";
var logoColourMode = "normal";
var logoAspect = "landscape";

function getLogos() {
    getLogo(logoServiceUri, '505', '01', null, 'operatorid', logoSize, logoColourMode, logoAspect, logoComplete);
}

function logoComplete(logoResult) {
    if (logoResult && logoResult.logos && logoResult.logos.length>=1) {
        var url = logoResult.logos[0].url;
        $('#loginButton').html('<img src="' + url + '" alt="Login with Mobile Connect" />');
    }
}