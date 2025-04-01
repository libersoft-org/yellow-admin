#!/bin/sh

set -e

[ ! -d "./node_modules/" ] && ./docker-dev-init.sh


export VITE_ADMIN_SERVER="ws://localhost:8085/"
export VITE_ADMIN_USERNAME="admin"
export VITE_ADMIN_PASSWORD="password"

npm run dev
