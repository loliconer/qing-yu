#! /bin/bash

npm install -g forever
npm install --production
cd server
cp template.db doc.db
cd scripts
node init.js
