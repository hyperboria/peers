# This script will generate somethings you just have to copy in your cjdroute.conf containing all the nodes

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
                            nodes_list[k] = {
                                "password": v["password"],
                                "publicKey": v["publicKey"],
                                "login": v["login"],
                                "contact": v["contact"]
                            }
            except:
                stderr.write("Got an error while reading : " + thing + "\n")
        else:
            search(thing)

for i in ["as","sa","na","af","eu","an","oc"]:
    if exists(i):
        search(i)

stdout.write(dumps(nodes_list) + "\n")
