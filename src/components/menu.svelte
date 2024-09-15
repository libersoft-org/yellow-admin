<script>
 import Core from '../core.js';
 import MenuItem from './menu-item.svelte';
 export let onSelectPage;
 let selectedMenuItem = ''

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
  Core.hideSidebarMobile.set(true);
  selectedMenuItem = name;
  onSelectPage(name);
 }

 function keySelectPage(name) {
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
 <MenuItem title="System status" active={selectedMenuItem === 'sysinfo'} icon="status.svg" clickFunction={() => clickSelectPage('sysinfo')} keyFunction={() => keySelectPage('sysinfo')} />
 <MenuItem title="Administrators" active={selectedMenuItem === 'admins'} icon="admins.svg" clickFunction={() => clickSelectPage('admins')} keyFunction={() => keySelectPage('admins')} />
 <MenuItem title="Domains" active={selectedMenuItem === 'domains'} icon="domains.svg" clickFunction={() => clickSelectPage('domains')} keyFunction={() => keySelectPage('domains')} />
 <MenuItem title="Users" active={selectedMenuItem === 'users'} icon="users.svg" clickFunction={() => clickSelectPage('users')} keyFunction={() => keySelectPage('users')} />
 <MenuItem title="Sessions" active={selectedMenuItem === 'sessions'} icon="sessions.svg" clickFunction={() => clickSelectPage('sessions')} keyFunction={() => keySelectPage('sessions')} />
 <MenuItem title="Logout" icon="logout.svg" clickFunction={clickLogout} keyFunction={keyLogout} />
</div>
