#!/bin/sh

[ ! -d "./node_modules/" ] && ./docker-dev-init.sh


export VITE_SERVER="ws://localhost:8086/"
export VITE_USERNAME="admin"
export VITE_PASSWORD="password"

npm run dev
