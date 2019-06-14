[![Build Status](https://secure.travis-ci.org/hyperboria/peers.png)](http://travis-ci.org/hyperboria/peers)

> A geographically sorted list of public peering credentials for joining [Hyperboria](https://hyperboria.net/).

[Hyperboria](https://hyperboria.net/) uses [cjdns](https://github.com/cjdelisle/cjdns) to construct an end-to-end-encrypted ipv6 mesh network.
Connections between nodes are established manually, and traffic is restricted to the resulting social graph.

This repository exists for those who don't already know somebody on Hyperboria.

## Using credentials

First, set up a cjdns node.

To connect your node to one of these public peers, follow [the steps in the cjdns README](https://github.com/cjdelisle/cjdns/#3-connect-your-node-to-your-friends-node).

## Adding your public node's credentials

If you've created a public node, and would like to have it listed here, fork the repo, add a keyfile, run `./tests.py` (make sure your file passes the test), and submit a PR.

We won't merge your credentials until our tests are passing.

### Filepath conventions
Credentials are sorted geographically, by [continent](https://github.com/hyperboria/docs/blob/master/cjdns/nodeinfo-json.md#regarding-continent-codes) code.
Nodes may be classified further, at the discretion of the node operator, and the administrators of the repository.

The suggested format is `/continent/country/region/municipality`. For example, `/na/ca/ontario/toronto/`.

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
* The following fields are not yet required, but are recommended:
  + gpg, listing your 16 character pgp fingerprint (all caps, no spaces)
  + peerName, a human-readable name for the node
* credentials should be formatted such that:
  - indentation uses four spaces
  - the file ends with a newline character.
* credentials must use IP:port strings for keys
  - credentials using hostnames will not be accepted
* If you are hosting it on a major server provider, please provide the name and shorthand for server. 
  - On digitalocean, That may be ```digitalocean sfo2```
  - On linode, that may be ```linode uswest``` or ```linode tokyo2```
  - On AWS, use the region, followed by the city. Usable Server names are listed can be found on found on the [AWS WEBSITE](https://aws.amazon.com/about-aws/global-infrastructure/)
  
      EX: useastnorthernvirginia,useastohio,southamericasaopaulo

```
{
    "192.168.1.5:10326":{
        "contact":"alice@bob.com",
        "gpg":"FC00FC00FC00FC00",
        "login":"default-login",
        "password":"nq1uhmf06k8c5594jqmpgy26813b81s",
        "peerName":"your-name-goes-here",
        "publicKey":"ssxlh80x0bqjfrnbkm1801xsxyd8zd45jkwn1zhlnccqj4hdqun0.k"
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
var Peers = require("hyperboria-peers");

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

console.log(Peers.peers.na.us.california);
```
