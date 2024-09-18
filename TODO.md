# Bugs

- Domains - fix lazy loader - it doesn't load more records when no need for scrolling
- Domains - domains-list.svelte - when exactly 10, 20, 30, 40, 50 etc. records are in table the loader is not deleted at the end of the table
- Domains - domains-list.svelte - resetTable() doesn't create a hidden loader again (when deleted already)
- When session is expired, it doesn't show any error

# Features

- Admins - list, add, edit, delete
- Sessions - list, add, delete
- Users - list, add, edit, delete
- Remove autologin in login.svelte -> onMount;
- Fix files rights
