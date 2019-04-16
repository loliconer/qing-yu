#! /bin/bash

rsync -avz --delete --exclude-from 'deploy_exclude.txt' package.json package-lock.json dist server user@1.1.1.1:~/project
