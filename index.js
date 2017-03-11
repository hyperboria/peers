var Fs = require("fs"),
    Package = require("./package.json"),
    version = module.exports.version = Package.version,
    Path = require("path"),
    DIRNAME = __dirname,
    read = function (p) {
        var content = Fs.readFileSync(p, 'utf-8');
        if (content.charAt(content.length - 1) !== '\n') {
            throw new Error("file at " + p + " did not end with a newline character");
        }
        return JSON.parse(content);
    },
    P = module.exports.peers = (function () {
        var pathFromArray = function (A) {
            return A.reduce(function (a, b) { return Path.join(a, b); }, '');
        };

        var isDir = function (fullPath) {
            return Fs.lstatSync(fullPath).isDirectory();
        };

        var getDir = function (A, f) {
            var p = pathFromArray(A);
            return Fs.readdirSync(p).filter(function (name) {
                var fullPath = pathFromArray([p, name]);
                return f(fullPath, A, name);
            });
        };

        var find = function (map, path) {
            /* safely search for nested values in an object via a path */
            return (map && path.reduce(function (p, n) {
                return typeof p[n] !== 'undefined' && p[n];
            }, map)) || undefined;
        }

        var peers = {};
        var walk = function (A) {
            getDir(A, function (fullPath, A, name) {
                if (/^\./.test(name)) {
                    // ignore hidden files
                } else if (isDir(fullPath)) {
                    find(peers, A.slice(1))[name] = {};
                    walk(A.concat(name));
                } else if (/\.k$/.test(name)) {
                    var obj = find(peers, A.slice(1))[name] = read(fullPath);
                    // embed the location in the object
                    obj.location = A.slice(1);
                }
            });
        };

        walk([DIRNAME]);
        return peers;
    }()),
    map = module.exports.map = function (f) {
        var L = [];

        // t/f is the object a credential
        var isCred = function (k) {
            // creds end in .k
            return /\.k/.test(k);
        };

        var walk = function (o, p, f) {
            // walk the tree of objects

            if (typeof(o) === 'object') {
                // for each key in o, walk the key
                Object.keys(o).forEach(function (k) {
                    var path = p.slice(0).concat(k);

                    if (isCred(k)) {
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

