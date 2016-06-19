# peers [![Build Status](https://secure.travis-ci.org/hyperboria/peers.png)](http://travis-ci.org/hyperboria/peers)

A geographically sorted list of public peering credentials for joining [Hyperboria](https://hyperboria.net/).

Hyperboria uses [cjdns](https://github.com/cjdelisle/cjdns) to construct an end-to-end-encrypted ipv6 mesh network.
Connections between nodes are established manually, and traffic is restricted to the resulting social graph.

This repository exists for those who don't already know somebody on Hyperboria.

## Adding your public node's credentials

If you've created a public node, and would like to have it listed here, fork the repo, add a keyfile, and submit a PR.

### Filepath conventions
Credentials are sorted geographically, by [continent](https://github.com/hyperboria/docs/blob/master/cjdns/nodeinfo-json.md#regarding-continent-codes), region, and municipality.

For example, a node in New York City is listed at `NA/us/newyork`.

Region and municipality codes are based on self identification, not any ISO standard.
An operator might prefer to list their node in Cascadia instead of Washington state.
For simplicity's sake, we'd prefer that new credentials conform to existing structures.

### JSON formatting

We have tried to standardize the structure of the actual credential files, as such, they have the strictest requirements of anything in this repository.

* Your credentials must be [valid JSON](http://jsonlint.com/).
* They must contain the necessary fields:
  + ip/port
  + password
  + publicKey
  + contact (a means of contacting the operator)
* credentials should be formatted such that:
  - there is a space after each colon
  - indentation uses four spaces
  - the file ends with a newline character.

```
{
    "192.168.1.5:10326": {
        "login": "default-login",
        "password": "nq1uhmf06k8c5594jqmpgy26813b81s",
        "publicKey": "ssxlh80x0bqjfrnbkm1801xsxyd8zd45jkwn1zhlnccqj4hdqun0.k",
        "peerName": "your-name-goes-here"
    }
}
```

### Naming your entry

Credential files must end with `.k`.
Otherwise, you can name your file whatever you want, but for simplicity's sake, avoid characters which will need to be escaped at the command line (or within the javascript api).

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

