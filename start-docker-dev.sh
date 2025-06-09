#!/bin/sh

set -e

./docker-dev-init.sh


#export VITE_ADMIN_SERVER=$SERVER_URL
export VITE_ADMIN_USERNAME="admin"
export VITE_ADMIN_PASSWORD="password"

npm run dev
