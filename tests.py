#!/usr/bin/env python3
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
    print("Validating %s" % path)
    try:
        creds = open(path).read()
        peers = json.loads("{%s}" % creds)
        hosts = peers.keys()
        warning = False
        for host in hosts:
            for field in REQUIRED_FIELDS:
                if not field in peers[host]:
                    print("    %sHost %s is missing the required field %s%s" % (RED, host,
                                                                                field, END))
                    return False
            for field in RECOMMENDED_FIELDS:
                if not field in peers[host]:
                    warning = True
                    print("    %sHost %s is missing the recommended field %s%s" % (YELLOW, host,
                                                                                   field, END))
        if warning:
            print("    %sSuccess, but missing recommended fields%s" % (YELLOW, END))
        else:
            print("    %sSuccess!%s" % (YELLOW, END))
        return True
    except ValueError:
        print("    %sInvalid JSON!%s" % (RED, END))
        return False

success = True
for directory, subdirs, files in os.walk('.'):
    if len(files) > 0:
        for f in files:
            if f.endswith('.k'):
                result = validate("%s/%s" % (directory, f))
                if not result:
                    success = False
if not success:
    sys.exit(1)
