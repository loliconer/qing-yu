#! /bin/bash

npm install -g forever
pnpm install
cd server
cp template.db doc.db
cd scripts
node init.js
