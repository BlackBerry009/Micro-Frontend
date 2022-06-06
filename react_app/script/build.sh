#!/bin/bash
set -e

rm -rf build
yarn run build:lib
yarn run build:normal

cp -r dist/* build
cp wrapper/routes/routes.json build/routes.json