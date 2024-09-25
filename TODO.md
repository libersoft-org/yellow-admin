# Bugs

- When domains table is sorted by ID DESC, it doesn't load more records by lazy loader
- Domains - lazy loader has ugly setTimeout - find another solution if possible

# Features

- Move columns and cells to separate components
- Cleanup code related to domains-list.svelte before copying to other pages
- Users - list, add, edit, delete
- Remove autologin in login.svelte -> onMount;
- Fix files rights
