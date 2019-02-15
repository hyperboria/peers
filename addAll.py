#!/usr/bin/env python3
# This script will generate somethings you just have to copy in your cjdroute.conf containing all the nodes
# You just have to copy the output in to connectTo
# Without flag you can pass an ip (6 or 4) wich is your, it will be excludede from the list

# If no argument was given it will output for ipv4 and if -6 is given it will run for ipv6

from os.path import exists, isfile
from os import listdir
from json import dumps, loads
from sys import exit, stdout, stderr, argv

arg = argv

global isIPV4
isIPV4 = not "-6" in arg
if not isIPV4:
    arg.remove("-6")
global yourIP
if len(arg) is 1:
    yourIP = arg[0]
else:
    yourIP = ""


global nodes_list
nodes_list = {}

def search(path):
    global nodes_list
    global isIPV4
    global yourIP
    for i in listdir(path):
        thing = path + "/" + i
        if isfile(thing):
            try:
                with open(thing, "r") as f:
                    for k, v in loads(f.read()).items():
                        # If ip format is the same as requested.
                        if ("." in k) is isIPV4 and k.split(":")[0] is not yourIP:
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
