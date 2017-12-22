/*
    if any of the supplied credentials:
        * are invalid JSON
        * do not end with a newline character,

    this file will not even load because index.js will throw errors
*/

var Peers = require("./index");

var isIp = function (host) {
    return ([
        /^[\[\]0-9a-f:]*$/i, // ipv6
        /^[0-9\.:]*$/, // ipv4
    ].some(function (patt) {
        return patt.test(host);
    }));
};

var credsWithDns = Peers.filter(function (x, p) {
    return Object.keys(x).some(function (k) {
        if (Array.isArray(x[k])) { return; }
        return !isIp(k);
    });
});

/* Credentials should use IPs, not dns hostnames */
if (credsWithDns.length) {
    console.log("The following peers are using DNS hostnames instead of IPs");
    console.log(credsWithDns);
}

/*  Credentials must have the required fields:
    * ip/port ✓
    * password
    * publicKey
    * contact
*/

var requiredFields = ['password', 'publicKey', 'contact', 'peerName'];
var recommendedFields = ['gpg', 'peerName'];

var insufficientFields = Peers.filter(function (x, p) {
    var problem = false;
    var comment = false;

    var path = '/' + p.join('/');

    var requiredMsg = "[%s] => %s is missing the required field '%s'";
    var recommendedMsg = "[%s] => '%s' is missing the recommended field '%s'";
    Object.keys(x).forEach(function (k) {
        if (Array.isArray(x[k])) { return; }


        var cred = x[k];
        var fields = Object.keys(cred);

        recommendedFields.forEach(function (field) {
            if (typeof(cred[field]) !== 'undefined') { return; }
            console.log(recommendedMsg, path, k, field);
            comment = true;
            problem = true;
        });

        requiredFields.forEach(function (field) {
            if (typeof(cred[field]) !== 'undefined') { return; }
            console.error(requiredMsg, path, k, field);
            problem = true;
        })
    });

    //if (comment || problem) { console.log(); }
    return problem;
});

if (insufficientFields.length) {
    //console.log("The following peers did not have all the required fields");
    //console.log(insufficientFields);
}

