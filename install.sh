#! /bin/bash

npm install -g forever
pnpm install --production --shamefully-flatten
cd server
cp template.db doc.db
cd scripts
node init.js
