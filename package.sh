#!/bin/bash

# Monorepo package script for OpenTTD Coopetition
# This script creates multiple zip files for different distribution targets

set -e

# Create output directory if it doesn't exist
mkdir -p dist

# Get version from version.nut
VERSION=$(grep -o 'COOPETITION_VERSION = [0-9]\+' src/version.nut | grep -o '[0-9]\+')

echo "Packaging Coopetition v${VERSION}..."

# Run quality gates
echo "Running quality gates..."
npm run test

# Build all components
echo "Building all components..."
npm run build:all

# Create complete package with everything
echo "Creating complete package..."
zip -r "dist/coopetition-complete-v${VERSION}.zip" \
    src/ \
    campaigns/ \
    workspaces/ \
    docs/ \
    build/ \
    LICENSE \
    README.md \
    package.json \
    -x "package.sh" "package.bat"

echo ""
echo "Packages created:"
echo "  - dist/coopetition-v${VERSION}.zip: Core GameScript mod"
echo "  - dist/coopetition-content-v${VERSION}.zip: Campaign content only"
echo "  - dist/coopetition-tools-v${VERSION}.zip: Development tools"
echo "  - dist/coopetition-complete-v${VERSION}.zip: Everything combined"
echo ""
echo "To install the mod, extract coopetition-v${VERSION}.zip to your OpenTTD game script directory in a 'coopetition' subfolder."