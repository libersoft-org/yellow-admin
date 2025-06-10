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

<div class="menu" data-testid="admin-menu">
 <MenuItem data-testid="menu-sysinfo" title="System status" active={selectedMenuItem === 'sysinfo'} icon="status.svg" callback={() => clickSelectPage('sysinfo')} />
 <MenuItem data-testid="menu-admins" title="Administrators" active={selectedMenuItem === 'admins'} icon="admins.svg" callback={() => clickSelectPage('admins')} />
 <MenuItem data-testid="menu-domains" title="Domains" active={selectedMenuItem === 'domains'} icon="domains.svg" callback={() => clickSelectPage('domains')} />
 <MenuItem data-testid="menu-users" title="Users" active={selectedMenuItem === 'users'} icon="users.svg" callback={() => clickSelectPage('users')} />
 <MenuItem data-testid="menu-modules" title="Modules" active={selectedMenuItem === 'modules'} icon="modules.svg" callback={() => clickSelectPage('modules')} />
 <MenuItem data-testid="menu-sessions" title="Sessions" active={selectedMenuItem === 'sessions'} icon="sessions.svg" callback={() => clickSelectPage('sessions')} />
 <MenuItem data-testid="menu-clients" title="Connected clients" active={selectedMenuItem === 'clients'} icon="clients.svg" callback={() => clickSelectPage('clients')} />
 <MenuItem data-testid="menu-logs" title="Logs" active={selectedMenuItem === 'logs'} icon="logs.svg" callback={() => clickSelectPage('logs')} />
 <MenuItem data-testid="menu-logout" title="Logout" icon="logout.svg" callback={clickLogout} />
</div>
