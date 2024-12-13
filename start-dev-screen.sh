#!/bin/sh

screen -dmS yellow-admin bash -c "trap bash SIGINT; (./start-dev.sh ; bash);"
