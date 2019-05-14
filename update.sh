#! /bin/bash

git pull
npm run build
cd server
forever restart app.js
