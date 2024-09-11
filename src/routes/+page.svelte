<script>
 import "../app.css";
 import { onMount } from 'svelte';
 import Socket from '../socket.js';
 import { hideSidebarMobile } from '../core.js';
 import Login from '../components/login.svelte';
 import Menu from '../components/menu.svelte';
 import WelcomeContent from '../components/welcome-content.svelte';

 const product = 'Yellow - Administration';
 const version = '0.01';
 const link = 'https://yellow.libersoft.org';
 let status;
 let isLoggedIn = false;
 let sideBar;
 let resizer;
 let isResizingSideBar = false;

 onMount(() => {
  Socket.events.addEventListener('open', event => {
   console.log('Connected to WebSocket:', event);
   status = { class: 'info', message: 'Connected to server' };
  });
  Socket.events.addEventListener('error', event => {
   console.error('WebSocket error:', event);
   status = { class: 'error', message: 'ERROR' };
  });
  Socket.events.addEventListener('close', event => {
   console.log('WebSocket closed:', event);
   status = { class: 'error', message: 'Disconnected from server' };
   let time = 5;
   const intervalID = setInterval(() => {
    time--;
    status = { class: 'error', message: 'Reconnecting in ' + time + ' ...' };
    if (time <= 0) {
     status = { class: 'error', message: 'Reconnecting to server ...' };
     Socket.connect();
     clearInterval(intervalID);
    }
   }, 1000);
  });
 });

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
  const min = 250;
  const max = 500;
  if (isResizingSideBar) {
   let sideBarWidth = e.clientX < max ? e.clientX : max;
   sideBarWidth = e.clientX > min ? sideBarWidth : min;
   sideBar.style.minWidth = sideBarWidth + 'px';
   resizer.style.left = sideBarWidth + 'px';
  }
 }
</script>

<style>
 .app {
  display: flex;
  flex-direction: column;
  height: 100vh;
 }

 .sidebar {
  display: flex;
  flex-direction: column;
  min-width: 300px;
  box-shadow: var(--shadow);
  background-color: #fff;
 }

 .resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 300px;
  width: 10px;
  margin-left: -5px;
  cursor: ew-resize;
  background-color: transparent;
 }

 .content {
  flex-grow: 1;
 }

 .status-bar {
  display: flex;
  align-items: center;
  height: 100px;
  background-color: #aaa;
  border-top: 1px solid #777;
  box-shadow: var(--shadow);
 }

 .status.info {
  color: #080;
  background-color: #dfd;
  border: 1px solid #080;
 }

 .status.error {
  color: #800;
  background-color: #fdd;
  border: 1px solid #800;
 }

 @media (max-width: 768px) {
  .sidebar {
   position: absolute;
   width: 100%;
   height: 100%;
  }

  .sidebar.hidden {
   display: none;
  }

  .resizer {
   display: none;
  }
 }
</style>

<svelte:head>
 <title>{product}</title>
</svelte:head>

<div class="app">
 {#if !isLoggedIn}
  <Login bind:isLoggedIn {product} {version} {link} />
 {:else}
 <div>
  <div class="sidebar {$hideSidebarMobile ? 'hidden' : ''}" bind:this={sideBar}>
   <Menu />
  </div>
  <div class="resizer" role="none" bind:this={resizer} on:mousedown={startResizeSideBar}></div>
  <div class="content">
   <WelcomeContent {product} {version} {link} />
  </div>
 </div>
 <div class="status-bar">123 {status?.class ? status.class : ''} {status?.message ? status.message : ''}</div>
 {/if}
</div>
