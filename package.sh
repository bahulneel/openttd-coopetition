#!/bin/bash

# Package script for OpenTTD Coopetition mod
# This script creates a zip file with all necessary files for distribution

# Create output directory if it doesn't exist
mkdir -p dist

# Get version from version.nut
VERSION=$(grep -o 'COOPETITION_VERSION = [0-9]\+' src/version.nut | grep -o '[0-9]\+')

# Create zip file
zip -r "dist/coopetition-v${VERSION}.zip" \
    src/*.nut \
    LICENSE \
    README.md \
    -x package.sh

echo "Package created: dist/coopetition-v${VERSION}.zip"
echo "To install, extract this zip to your OpenTTD game script directory in a 'coopetition' subfolder."