<script>
 import Core from '../core.js';
 import Socket from '../socket.js';
 import MenuItem from './menu-item.svelte';
 export let isLoggedIn = false;

 function logout() {
  Socket.disconnect();
  Core.userAddress = null;
  Core.sessionID = null;
  Core.hideSidebarMobile.update(() => false);
  isLoggedIn = false;
 }

 function clickLogout() {
  logout();
  clickMenuClose();
 }

 function keyLogout(event) {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickLogout();
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
 <MenuItem title="System status" icon="status.svg" clickFunction="clickStatus" keyFunction="keyStatus" />
 <MenuItem title="Administrators" icon="admins.svg" clickFunction="clickAdmins" keyFunction="keyAdmins" />
 <MenuItem title="Domains" icon="domains.svg" clickFunction="clickDomains" keyFunction="keyDomains" />
 <MenuItem title="Users" icon="users.svg" clickFunction="clickUsers" keyFunction="keyUsers" />
 <MenuItem title="Sessions" icon="sessions.svg" clickFunction="clickSessions" keyFunction="keySessions" />
 <MenuItem title="Logout" icon="logout.svg" clickFunction="clickLogout" keyFunction="keyLogout"  />
</div>
