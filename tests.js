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

var requiredFields = ['password', 'publicKey', 'contact'];

var insufficientFields = Peers.filter(function (x, p) {
    var problem = false;
    Object.keys(x).map(function (k) {
        var cred = x[k];
        var fields = Object.keys(cred);
        requiredFields.forEach(function (field) {
            if (fields.indexOf(field) === -1) {
                problem = true;
            }
        });
    });
    return problem;
});

if (insufficientFields.length) {
    console.log("The following peers did not have all the required fields");
    console.log(insufficientFields);
}

/*  Credentials must be short enough *as is* that they will not trigger
    the connectTo-overflow bug.
*/

// TODO check if this bug still exists in cjdns
// TODO add bencoding and check length
