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

* Your credentials must be [valid JSON](http://jsonlint.com/) when inserted into a block of curly braces `{}`
* They should be small enough so as to be inserted into a `cjdroute.conf` **as is** without triggering the [connectTo-overflow bug](https://github.com/hyperboria/docs/blob/master/bugs/connectTo-overflow.md).
* They must contain the necessary fields:
  + ip/port
  + password
  + publicKey
  + contact info (preferably email)
* If you have GPG key then include your full key fingerprint.
* Indentation is 4 spaces.
* There should be space after a colon.
* Credentials should end with a newline character.
* There is formatting script available `format.sh`. It requires `jq` utility.


```
"192.168.1.5:10326": {
    "login": "default-login",
    "password": "nq1uhmf06k8c5594jqmpgy26813b81s",
    "publicKey": "ssxlh80x0bqjfrnbkm1801xsxyd8zd45jkwn1zhlnccqj4hdqun0.k",
    "peerName": "your-name-goes-here",
    "contact": "j.smith@example.com"
}

```

> Note: the snippet above is **not valid json**. It would need to be wrapped in an additional block of curly braces `{  }`

## Naming your entry

You can name your file whatever you want, but for simplicity's sake, avoid characters which will need to be escaped at the command line.
