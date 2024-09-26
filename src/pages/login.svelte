<script>
 import { onMount } from 'svelte';
 import { socketState, socketStates, connect } from '../socket.js';
 import { isLoggedIn, loginError, login } from '../core.js';
 import Button from '../components/button.svelte';
 export let product;
 export let version;
 export let link;
 let credentials = { server: '', username: '', password: '' };
 let loggingIn = false;

 onMount(() => {
  credentials.server = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + '/';
  if (import.meta.env.VITE_SERVER) {
   credentials = {
    server: import.meta.env.VITE_SERVER,
    username: import.meta.env.VITE_USERNAME,
    password: import.meta.env.VITE_PASSWORD
   };
   clickLogin();
  }
 });

 $: if ($socketState === socketStates.OPEN && loggingIn) login(credentials);
 $: if ($loginError) loggingIn = false;
 $: if ($isLoggedIn) loggingIn = false;
 $: console.log('loginError:', $loginError);

 function clickLogo() {
  window.open(link, '_blank');
 }

 function keyLogo() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickLogo();
  }
 }

 function clickLogin() {
  console.log('clickLogin loggingIn:', loggingIn);
  if (loggingIn) return;
  loggingIn = true;
  loginError.set(null);
  setTimeout(() => {
   console.log('clickLogin credentials:', credentials);
   connect(credentials.server);
  }, 0);
 }

 function keyLogin() {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickLogin();
  }
 }
</script>

<style>
 .background {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: url('/img/background.webp') repeat;
  background-size: 400px;
 }

 .login {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 400px;
  max-width: calc(100% - 60px);
  padding: 10px;
  border: 1px solid #999;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: var(--shadow);
 }

 .login .logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
 }

 .login .version {
  display: flex;
  justify-content: center;
  gap: 5px;
 }

 .login .logo img {
  width: 50px;
  height: 50px;
 }

 .login .logo .product {
  font-size: 25px;
  font-weight: bold;
 }

 .login .form {
  display: flex;
  flex-direction: column;
  gap: 15px;
 }

 .login .form .group {
  display: flex;
  flex-direction: column;
  gap: 2px;
 }

 .login .form .group .label {
  font-size: 15px;
  padding-left: 5px;
  font-weight: bold;
 }

 .login .form .group input {
  padding: 10px;
  border: 1px solid #999;
  border-radius: 10px;
 }

 .login .form .error {
  display: flex;
  gap: 5px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f33;
 }
</style>

<div class="background">
 <div class="login">
  <div class="logo" role="button" tabindex="0" on:click={clickLogo} on:keydown={keyLogo}>
   <img src="img/logo.svg" alt={product} />
   <div class="product">{product}</div>
  </div>
  <div class="version">
   <div>Version:</div>
   <div class="bold">{version}</div>
  </div>
  <div class="form">
   <div class="group">
    <div class="label">Server:</div>
    <input type="text" placeholder="wss://your_server/" bind:value={credentials.server} on:keydown={keyLogin} />
   </div>
   <div class="group">
    <div class="label">User name:</div>
    <input type="text" placeholder="Administrator's user name" bind:value={credentials.username} on:keydown={keyLogin} />
   </div>
   <div class="group">
    <div class="label">Password:</div>
    <input type="password" placeholder="Password" bind:value={credentials.password} on:keydown={keyLogin} />
   </div>
   {#if $loginError}
    <div class="error">
     <div class="bold">Error:</div>
     <div>{$loginError}</div>
    </div>
   {/if}
   <Button disabled={loggingIn} on:click={clickLogin}>
    {#if loggingIn}
     <div class="loader"></div>
    {:else}
     Login
    {/if}
   </Button>
  </div>
 </div>
</div>
