#!/bin/bash

# For each definition, gather usage information by subsystem. Rather slow, O(n^2).

for line in $(cat usage+defs.txt); do
	if [[ $line == *\+ ]]; then
		echo $line
		declare -A counts

		searchstr=$(echo $line | cut -d : -f 2 | sed 's/+//')
		for subsys in $(grep -E ':'$searchstr'$' usage+defs.txt | cut -d : -f 1); do
			counts[$subsys]=$((counts[$subsys] + 1))
		done
		for subsys in "${!counts[@]}"; do
			echo "$subsys:${counts[$subsys]}"
		done
		unset counts
	fi
done
