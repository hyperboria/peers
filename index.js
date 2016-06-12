var Fs = require("fs"),
    R = function (p) {
        var content = Fs.readFileSync(p, 'utf-8');
        if (content.charAt(content.length - 1) !== '\n') {
            throw new Error("file at " + p + " did not end with a newline character");
        }
        return JSON.parse(content);
    },
    P = module.exports.peers = {
        AS: {
            hk: {
                'hk.hub.icfreedom.net.k': R('./AS/hk/hk.hub.icfreedom.net.k'),
            },
            sg: {
                singapore: {
                    'sg.hub.icfreedom.net.k': R('./AS/sg/singapore/sg.hub.icfreedom.net.k'),
                    'weuxel.sing.k': R('./AS/sg/singapore/weuxel.sing.k'),
                },
            },
        },
        EU: {
            de: {
                bavaria: {
                    'hype.jazzanet.com.k': R('./EU/de/bavaria/hype.jazzanet.com.k'),
                },
            },
            fr: {
                'nord-pas-de-calais': {
                    'hub.icfreedom.net.k': R('./EU/fr/nord-pas-de-calais/hub.icfreedom.net.k'),
                    'play.fallofanempire.com.k': R('./EU/fr/nord-pas-de-calais/play.fallofanempire.com.k'),
                },
                strasbourg: {
                    'magik6k.net.k': R('./EU/fr/strasbourg/magik6k.net.k'),
                },
            },
            gr: {
                rethymno: {
                    'kaotisk.rethymno-meshnet.k': R('./EU/gr/rethymno/kaotisk.rethymno-meshnet.k'),
                },
            },
            md: {
                chisinau: {
                    'eu-east.hub.icfreedom.net.k': R('./EU/md/chisinau/eu-east.hub.icfreedom.net.k'),
                },
            },
            nl: {
                amsterdam: {
                    'mrowr.me.k': R('./EU/nl/amsterdam/mrowr.me.k'),
                    'weuxel.ams.k': R('./EU/nl/amsterdam/weuxel.ams.k'),
                },
            },
            ru: {
                moscow: {
                    'h.bunjlabs.com.k': R('./EU/ru/moscow/h.bunjlabs.com.k'),
                },
            },
            se: {
                lulea: {
                    'bliss.willeponken.me.k': R('./EU/se/lulea/bliss.willeponken.me.k'),
                },
            },
            uk: {
                london: {
                    'ansuz.science.k': R('./EU/uk/london/ansuz.science.k'),
                },
            },
        },
        NA: {
            ca: {
                quebec: {
                    'ca.hub.icfreedom.net.k': R('./NA/ca/quebec/ca.hub.icfreedom.net.k'),
                },
                beauharnois: {
                    'derp.fusion.k': R('./NA/ca/beauharnois/derp.fusion.k'),
                },
            },
            us: {
                california: {
                    'igel-california.usa.k': R('./NA/us/california/igel-california.usa.k'),
                },
                newyork: {
                    'jacobhenner.usa.k': R('./NA/us/newyork/jacobhenner.usa.k'),
                    'weuxel.usa.k': R('./NA/us/newyork/weuxel.usa.k'),
                },
                northcarolina: {
                    'igel-northcarolina.usa.k': R('./NA/us/northcarolina/igel-northcarolina.usa.k'),

                },
                oregon: {
                    'h.us-west.hub.icfreedom.net.k': R('./NA/us/oregon/h.us-west.hub.icfreedom.net.k'),
                },
                pennsylvania: {
                    'nat.usa.k': R('./NA/us/pennsylvania/nat.usa.k'),
                },
            },
        },
    },
    map = module.exports.map = function (f) {
        var L = [];

        // t/f is the object a credential
        var isCred = function (k) {
            // creds end in .k
            return /\.k/.test(k);
            return true;
        };

        var walk = function (o, p, f) {
            // walk the tree of objects

            if (typeof(o) === 'object') {
                // for each key in o, walk the key
                Object.keys(o).forEach(function (k) {
                    var path = p.slice(0).concat(k);


                    if (isCred(k)) {
                        //console.log(o[k]);
                        L.push(f(o[k], path));
                    }
                    walk(o[k], path, f);
                });
            }
        };

        walk(P, [], f);
        return L;
    },
    filter = module.exports.filter = function (f) {
        var L = [];
        map(function (x, p) {
            if (f(x,p)) { L.push(x); }
        });
        return L;
    };
