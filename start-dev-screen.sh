#!/bin/sh

screen -dmS yellow-admin bash -c ". ./colors.sh; trap bash SIGINT; (./start-dev.sh ; bash);"
