<script>
 import Core from '../core.js';
 import MenuItem from './menu-item.svelte';
 export let onSelectPage;

 function clickLogout() {
  Core.logout();
 }

 function keyLogout(name) {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickLogout();
  }
 }

 function clickSelectPage(name) {
  onSelectPage(name);
 }

 function keySelectedPage(name) {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickSelectedPage(name);
  }
 }
</script>

<style>
 .menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #222;
  color: #fff;
  box-shadow: var(--shadow);
 }
</style>

<div class="menu">
 <MenuItem title="System status" icon="status.svg" clickFunction={() => clickSelectPage('sysinfo')} keyFunction={() => keySelectPage('sysinfo')} />
 <MenuItem title="Administrators" icon="admins.svg" clickFunction={() => clickSelectPage('admins')} keyFunction={() => keySelectPage('admins')} />
 <MenuItem title="Domains" icon="domains.svg" clickFunction={() => clickSelectPage('domains')} keyFunction={() => keySelectPage('domains')} />
 <MenuItem title="Users" icon="users.svg" clickFunction={() => clickSelectPage('users')} keyFunction={() => keySelectPage('users')} />
 <MenuItem title="Sessions" icon="sessions.svg" clickFunction={() => clickSelectPage('sessions')} keyFunction={() => keySelectPage('sessions')} />
 <MenuItem title="Logout" icon="logout.svg" clickFunction={clickLogout} keyFunction={keyLogout} />
</div>
