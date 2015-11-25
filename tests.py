#!/usr/bin/env python3
import json
import os
import sys

REQUIRED_FIELDS = ['publicKey', 'password', 'contact']


RED = '\x1b[01;31m'
GREEN = '\x1b[01;32m'
END = '\x1b[0m'


def validate(path):
    print("Validating %s" % path)
    try:
        creds = open(path).read()
        peers = json.loads("{%s}" % creds)
        hosts = peers.keys()
        for host in hosts:
            for field in REQUIRED_FIELDS:
                if not field in peers[host]:
                    print("    %sHost %s is missing the %s field!%s" % (RED, host, field, END))
                    return False
        print("    %sSuccess!%s" % (GREEN, END))
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
