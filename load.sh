#!/bin/bash

# Cache the source tree. Good for experimentation.

mkdir -p /mnt/ram
mount -t ramfs -o ramfs /mnt/ram 
cp -r /home/vk/work/cs194-24/labs/cs194-gd/linux /mnt/ram/linux
