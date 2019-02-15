#!/usr/bin/env python3
# This script will generate somethings you just have to copy in your cjdroute.conf containing all the nodes
# You just have to copy the output in to connectTo

# If no argument was given it will output for ipv4 and if -6 is given it will run for ipv6

from os.path import exists, isfile
from os import listdir
from json import dumps, loads
from sys import exit, stdout, stderr, argv

global nodes_list
nodes_list = {}

def search(path):
    global nodes_list
    for i in listdir(path):
        thing = path + "/" + i
        if isfile(thing):
            try:
                with open(thing, "r") as f:
                    for k, v in loads(f.read()).items():
                        # If ip format is the same as requested.
                        if ("." in k) is (not "-6" in argv):
                            node = {
                                "password": v["password"],
                                "publicKey": v["publicKey"],
                                "contact": v["contact"]
                            }
                            try:
                                node["login"] = v["login"]
                            except:
                                pass
                            nodes_list[k] = node
            except:
                stderr.write("Got an error while reading : " + thing + "\n")
        else:
            search(thing)

for i in ["as","sa","na","af","eu","an","oc"]:
    if exists(i):
        search(i)

stdout.write("".join(list(dumps(nodes_list))[1:-1]) + "\n")

exit(1)
