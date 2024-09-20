<script>
 import '../app.css';
 import { socketState, socketStates, connect } from '../socket.js';
 import { hideSidebarMobile, isLoggedIn } from '../core.js';
 import Login from '../pages/login.svelte';
 import Menu from '../components/menu.svelte';
 import WelcomeContent from '../pages/welcome-content.svelte';
 import SysInfo from '../pages/sysinfo.svelte';
 import AdminsList from '../pages/admins-list.svelte';
 import DomainsList from '../pages/domains-list.svelte';
 import UsersList from '../pages/users-list.svelte';
 import SessionsList from '../pages/sessions-list.svelte';
 const product = 'Yellow - Administration';
 const version = '0.01';
 const link = 'https://yellow.libersoft.org';
 const pages = {
  sysinfo: SysInfo,
  admins: AdminsList,
  domains: DomainsList,
  users: UsersList,
  sessions: SessionsList
 };
 let selectedPage = null;
 let status;
 let sideBar;
 let resizer;
 let isResizingSideBar = false;
 let contentElement;

 $: if ($isLoggedIn && $socketState === socketStates.OPEN) {
  console.log('Connected to server');
  status = { class: 'info', message: 'Connected to server' };
 }

 $: if ($isLoggedIn && $socketState === socketStates.CLOSED) {
  console.error('Disconnected from server - reconnecting ...');
  status = { class: 'error', message: 'Disconnected from server - reconnecting ...' };
  connect();
 }

 $: if ($isLoggedIn) selectedPage = null;

 function startResizeSideBar() {
  isResizingSideBar = true;
  document.body.style.userSelect = 'none';
  window.addEventListener('mousemove', resizeSideBar);
  window.addEventListener('mouseup', stopResizeSideBar);
 }

 function stopResizeSideBar() {
  isResizingSideBar = false;
  document.body.style.userSelect = '';
  window.removeEventListener('mousemove', resizeSideBar);
  window.removeEventListener('mouseup', stopResizeSideBar);
 }

 function resizeSideBar(e) {
  const min = 200;
  const max = 500;
  if (isResizingSideBar) {
   let sideBarWidth = e.clientX < max ? e.clientX : max;
   sideBarWidth = e.clientX > min ? sideBarWidth : min;
   sideBar.style.minWidth = sideBarWidth + 'px';
   resizer.style.left = sideBarWidth + 'px';
  }
 }

 function onSelectPage(name) {
  selectedPage = pages[name];
 }
</script>

<style>
 :root {
  --status-height: 30px;
  --sidebar-width: 250px;
 }

 .app {
  display: flex;
  flex-direction: column;
 }

 .main {
  display: flex;
  flex-grow: 1;
  height: calc(100vh - var(--status-height) - 21px);
 }

 .main .sidebar {
  display: flex;
  flex-direction: column;
  min-width: var(--sidebar-width);
  box-shadow: var(--shadow);
  background-color: #222;
  overflow-y: auto;
 }

 .main .resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--sidebar-width);
  width: 5px;
  cursor: ew-resize;
  background-color: transparent;
 }

 .main .content {
  background: url('/img/background.webp') repeat;
  background-size: 400px;
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
 }

 .status {
  display: flex;
  align-items: center;
  gap: 10px;
  height: var(--status-height);
  padding: 10px;
  background-color: #222;
  color: #fff;
  box-shadow: var(--shadow);
 }

 .status .indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
 }

 .status .indicator.info {
  background-color: #0c0;
 }

 .status .indicator.error {
  background-color: #c00;
 }

 @media (max-width: 768px) {
  .main .sidebar {
   position: absolute;
   width: 100%;
   height: 100%;
  }

  .main .sidebar.hidden {
   display: none;
  }

  .main .resizer {
   display: none;
  }
 }
</style>

<svelte:head>
 <title>{product}</title>
</svelte:head>

<div class="app">
 {#if !$isLoggedIn}
  <Login {product} {version} {link} />
 {:else}
  <div class="main">
   <div class="sidebar {$hideSidebarMobile ? 'hidden' : ''}" bind:this={sideBar}>
    <Menu {onSelectPage} />
   </div>
   <div class="resizer" role="none" bind:this={resizer} on:mousedown={startResizeSideBar}></div>
   <div class="content" bind:this={contentElement}>
    {#if selectedPage}
     <svelte:component this={selectedPage} {contentElement} />
    {:else}
     <WelcomeContent {product} {version} {link} />
    {/if}
   </div>
  </div>
  <div class="status">
   <div class="indicator {status?.class ? status.class : ''}"></div>
   <div>{status?.message ? status.message : ''}</div>
  </div>
 {/if}
</div>
