#!/bin/bash

# Gather struct definitions and usages.

grep -roEI --exclude-from=excludes.list "struct\s+([a-zA-Z][_a-zA-Z0-9]*)(\s*\{)?" /mnt/ram/linux | grep -vE "(tools|scripts|Documentation|samples):" | sed "s|/mnt/ram/linux/||g" | sed -r "s|/(.*):|:|g" | sed -r "s/struct\s+//g" | sed -r "s/\s+\{/\+/g" > usage+defs.txt
