#!/bin/sh

echo -ne "\033]0;YELLOW ADMIN\007"
#bun --bun run dev
bun i --frozen-lockfile
npm run dev
