#! /bin/bash

npm install -g forever
npm install
npm run build
cd server
cp template.db doc.db
cd scripts
node init.js
