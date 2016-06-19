# peers [![Build Status](https://secure.travis-ci.org/hyperboria/peers.png)](http://travis-ci.org/hyperboria/peers)

listing public peers

## Adding your public node's credentials

If you've created a public node, and would like to have it listed here, fork the repo, add a keyfile, and submit a PR.

## Nodeinfo.json

This repository is meant to extend the [nodeinfo.json standard](https://github.com/hyperboria/docs/blob/master/cjdns/nodeinfo-json.md "nodeinfo.json standard, from Hyperboria's docs repo").
`nodeinfo.json` is a valid [JSON](http://www.json.org/ "the Javascript Object Notation standard") file hosted on a webserver's root which displays information about that node:

* services it hosts
* who operates the node
* where the node is located

There are a number of individuals who have taken to analyzing data exposed by their nodes' cjdns admin interfaces, and by crawling webservers for html and structured JSON.
Centralized listings make it easier for anyone to view information which node operators have volunteered, though, it should be trivial for you to verify this information by virtue of it being self-hosted.

## Naming conventions

Node operators who have voluntarily included information about their nodes' location are making it easier to create a programmatic method of finding peers who are in your vicinity.
The specification includes seven fields which make this possible:

1. continent
2. region
3. municipality
4. latitude
5. longitude
6. altitude
7. uri

Numbers 4-6 provide exact coordinates of a node. The structure of this repository will adhere to the hierarchy imposed by the first three.
As such, if you'd like to list your node here, you will need to determine [your continent code](https://github.com/hyperboria/docs/blob/master/cjdns/nodeinfo-json.md#regarding-continent-codes), your region, and your municipality.

Your continent should be relatively unambiguous, however, your region likely isn't.
For our purposes, it only matters in that other members of your region should agree.
Like hashtags, they are most effective when consistent and descriptive.
Start by finding someone else in your area, and follow their lead.

Assuming `peers/` is the repository root, your peering credentials should be located in `peers/{continent}/{region}/{municipality}/`.

By following this scheme, we make it possible for users to programmatically find peers in their vicinity, which should make adoption of [cjdns](https://github.com/cjdelisle/cjdns) easier.

## JSON formatting

* Your credentials must be [valid JSON](http://jsonlint.com/).
* They must contain the necessary fields:
  + ip/port
  + password
  + publicKey
  + contact (a means of contacting the operator)
* credentials should end with a newline character.


```
{
    "192.168.1.5:10326": {
        "login": "default-login",
        "password":"nq1uhmf06k8c5594jqmpgy26813b81s",
        "publicKey":"ssxlh80x0bqjfrnbkm1801xsxyd8zd45jkwn1zhlnccqj4hdqun0.k",
        "peerName":"your-name-goes-here"
    }
}
```

## Naming your entry

Credential files must end with `.k`.
Otherwise, you can name your file whatever you want, but for simplicity's sake, avoid characters which will need to be escaped at the command line.

## Javascript API

Peering credentials in this repository can be accessed via a simple Javascript API (using Nodejs).

It's available as a module on npm:

`npm install hyperboria-peers`

### Usage

```Javascript
var Peers = require("./index.js");

/*  return a list of public peers located in North America */
Peers.filter(function (creds, path) {
    return path.indexOf('NA') !== -1;
});

/*  return a list of public keys */
Peers.map(function (creds, path) {
    return creds[Object.keys(creds)[0]].publicKey;
});

/*  the underlying data is exposed in a nested json structure */
console.log(Peers.peers);

console.log(Peers.peers.NA.us.california);
```

