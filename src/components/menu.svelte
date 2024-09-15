<script>
 import Core from '../core.js';
 import MenuItem from './menu-item.svelte';

 function clickLogout() {
  Core.logout();
 }

 function clickStatus() {
  
 }

 function clickAdmins() {
  
 }

 function clickDomains() {
  
 }

 function clickUsers() {
  
 }

 function clickSessions() {
  
 }

 function keyFunction(clickFunction) {
  return function(event) {
   if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    clickFunction();
   }
  };
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
 <MenuItem title="System status" icon="status.svg" clickFunction={clickStatus} keyFunction={keyFunction(clickStatus)} />
 <MenuItem title="Administrators" icon="admins.svg" clickFunction={clickAdmins} keyFunction={keyFunction(clickAdmins)} />
 <MenuItem title="Domains" icon="domains.svg" clickFunction={clickDomains} keyFunction={keyFunction(clickDomains)} />
 <MenuItem title="Users" icon="users.svg" clickFunction={clickUsers} keyFunction={keyFunction(clickUsers)} />
 <MenuItem title="Sessions" icon="sessions.svg" clickFunction={clickSessions} keyFunction={keyFunction(clickSessions)} />
 <MenuItem title="Logout" icon="logout.svg" clickFunction={clickLogout} keyFunction={keyFunction(clickLogout)} />
</div>
