#!/usr/bin/env bash
# Copyright © 2016 Jakub Sztandera <kubuxu@protonmail.ch> 
#   This work is free. You can redistribute it and/or modify it under the
#   terms of the Do What The Fuck You Want To Public License, Version 2,
#   as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
#
# This tools requires awk, sed and jq.
#

if [ "$#" -lt 1 ]; then
	echo "Usage: $0 FILE..." >&2
	echo "Formants file in correnct way for peers repo."
	exit 1
fi

for f in "$@"; do
	if ! [ -f "$f" ]; then
		echo "File not found: $f"
	fi

	tmpfile=$(mktemp /tmp/peers-format.XXXXXX)
	awk 'BEGIN { print "{" } { print } END { print "}" }' "$f" \
		| jq . | sed '$d' | sed '1d' | sed 's/^  //' | sed 's/  /    /' > "$tmpfile"

	if [ "${PIPESTATUS[1]}" -ne 0 ]; then
		echo "Could not format $f, check if JSON in it is valid."
		rm "$tmpfile"
	else
		echo "Successfully formated $f" 
		mv -f "$tmpfile" "$f"
	fi
done
