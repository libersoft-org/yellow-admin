<script>
 import Core from '../core.js';
 import MenuItem from './menu-item.svelte';
 export let onSelectPage;
 let selectedMenuItem = '';

 function clickLogout() {
  Core.logout();
 }

 function clickSelectPage(name) {
  Core.hideSidebarMobile.set(true);
  selectedMenuItem = name;
  onSelectPage(name);
 }
</script>

<style>
 .menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #fff;
  box-shadow: var(--shadow);
 }
</style>

<div class="menu">
 <MenuItem title="System status" active={selectedMenuItem === 'sysinfo'} icon="status.svg" callback={() => clickSelectPage('sysinfo')} />
 <MenuItem title="Administrators" active={selectedMenuItem === 'admins'} icon="admins.svg" callback={() => clickSelectPage('admins')} />
 <MenuItem title="Domains" active={selectedMenuItem === 'domains'} icon="domains.svg" callback={() => clickSelectPage('domains')} />
 <MenuItem title="Users" active={selectedMenuItem === 'users'} icon="users.svg" callback={() => clickSelectPage('users')} />
 <MenuItem title="Sessions" active={selectedMenuItem === 'sessions'} icon="sessions.svg" callback={() => clickSelectPage('sessions')} />
 <MenuItem title="Logout" icon="logout.svg" callback={clickLogout} />
</div>
