#!/bin/bash
# abort on errors
# set -e
# build
# navigate into the build output directory
# npm run build
# npx workbox injectManifest workbox-config.js
# firebase deploy --only hosting
# cd dist
# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME
# git init
# git add -A
# git commit -m 'deploy v0.3'
# git push -f git@github.com:fauziru/pdm.git master:gh-pages
# cd -
# yarn build
cd dist
# if you are deploying to a custom domain
git init
git add -A
git commit -m 'Build v1.0.0 Dhydro'
git push -f git@github.com:fauziru/HydroFarm.git master:production
cd -