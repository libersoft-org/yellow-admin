# Bugs

- Domains - lazy loader has ugly setTimeout - find another solution if possible
- When session is expired, it doesn't show any error

# Features

- Domains - extract lazy loading component to new component
- Admins, Sessions, Users - on backend delete "No more records" error - switch to: [] (the same as Domains)
- Domains - add filter - ID + name
- Admins - list, add, edit, delete
- Sessions - list, add, delete
- Users - list, add, edit, delete
- Remove autologin in login.svelte -> onMount;
- Fix files rights
