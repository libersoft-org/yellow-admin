#!/bin/sh

screen -dmS yellow-admin bash -c '
echo -ne "\033]0;YELLOW ADMIN\007"
#bun --bun run dev
npm run dev
'