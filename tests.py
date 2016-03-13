#!/usr/bin/env python3
"""Checks that the peering details in this repo conform to a few basic rules."""
import json
import os
import sys

REQUIRED_FIELDS = ['publicKey', 'password', 'contact']
RECOMMENDED_FIELDS = ['gpg']

RED = '\x1b[01;31m'
GREEN = '\x1b[01;32m'
YELLOW = '\x1b[01;33m'
END = '\x1b[0m'


def validate(path):
    """Test a single set of peering creds."""
    print("Validating %s" % path)
    try:
        creds = open(path).read()
        peers = json.loads(creds)
        # Check formatting
        pretty = json.dumps(peers, sort_keys=True, indent=4, separators=(',', ':'))
        pretty = "%s\n" % pretty
        formatting = True
        if pretty != creds:
            if "--clean" in sys.argv:
                with open(path, 'w') as outfile:
                    outfile.write(pretty)
                print("    %sJSON in %s has been fixed.%s" % (YELLOW, path, END))
            else:
                print("    %sJSON in %s is NOT properly formatted.%s" % (YELLOW, path, END))
                formatting = False
        hosts = peers.keys()
        for host in hosts:
            for field in REQUIRED_FIELDS:
                if field not in peers[host]:
                    print("    %sHost %s is missing the required field %s%s" % (RED, host,
                                                                                field, END))
                    return False
            for field in RECOMMENDED_FIELDS:
                if field not in peers[host]:
                    print("    %sHost %s is missing the recommended field %s%s" % (YELLOW, host,
                                                                                   field, END))
        if not formatting:
            return False
    except ValueError:
        print("    %sInvalid JSON!%s" % (RED, END))
        return False

if __name__ == "__main__":
    success = True
    for directory, subdirs, files in os.walk('.'):
        if len(files) > 0:
            if directory != '.' and not directory.startswith('./.git'):
                for f in files:
                    result = validate("%s/%s" % (directory, f))
                    if not result:
                        success = False
    if not success:
        sys.exit(1)
