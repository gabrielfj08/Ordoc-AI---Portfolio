#!/bin/bash

echo "Bumping version to number $1"

git tag $1

echo "{"                                                    >  public/manifest.json
echo "  \"name\": \"Printer Cloud\","                       >> public/manifest.json
echo "  \"version\": \"$(git describe --tags --always)\","  >> public/manifest.json
echo "  \"released_at\": \"$(git log -1 --format=%aI)\""    >> public/manifest.json
echo "}"                                                    >> public/manifest.json
