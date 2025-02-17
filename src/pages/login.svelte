<script>
 import { onMount } from 'svelte';
 import { socketState, socketStates, connect } from '../socket.js';
 import { isLoggedIn, loginError, login, product, version, build, commit, link } from '../core.js';
 import Spinner from '../components/spinner.svelte';
 import BaseButton from '../components/base-button.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Alert from '../components/alert.svelte';
 let credentials = { server: '', username: '', password: '' };
 let loggingIn = false;

 onMount(() => {
  credentials.server = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + '/';
  if (import.meta.env.VITE_ADMIN_SERVER) {
   credentials = {
    server: import.meta.env.VITE_ADMIN_SERVER,
    username: import.meta.env.VITE_ADMIN_USERNAME,
    password: import.meta.env.VITE_ADMIN_PASSWORD
   };
   clickLogin();
  }
 });

 $: if ($socketState === socketStates.OPEN && loggingIn) login(credentials);
 $: if ($loginError) loggingIn = false;
 $: if ($isLoggedIn) loggingIn = false;
 //$: console-log('loginError:', $loginError);

 function clickLogo() {
  window.open(link, '_blank');
 }

 function clickLogin() {
  //console.log('clickLogin loggingIn:', loggingIn);
  if (loggingIn) return;
  loggingIn = true;
  loginError.set(null);
  setTimeout(() => {
   //console.log('clickLogin credentials:', credentials);
   connect(credentials.server);
  }, 0);
 }

 function keyLogin(event) {
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
  padding: 10px;
  border: 1px solid #999;
  border-radius: 10px;
  background-color: #ffd;
 }

 .login .version table {
  table-layout: fixed;
  display: inline-table;
  align-self: flex-start;
 }

 .login .version .left {
  text-align: right;
 }

 .login .version .right {
  font-weight: bold;
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
</style>

<div class="background">
 <div class="login">
  <BaseButton onClick={clickLogo}>
   <div class="logo">
    <img src="img/logo.svg" alt={product} />
    <div class="product">{product}</div>
   </div>
  </BaseButton>
  <div class="version">
   <table>
    <tbody>
     <tr>
      <td class="left">Version:</td>
      <td class="right">{version}</td>
     </tr>
     <tr>
      <td class="left">Build:</td>
      <td class="right">{build}</td>
     </tr>
     <tr>
      <td class="left">Commit:</td>
      <td class="right">{commit}</td>
     </tr>
    </tbody>
   </table>
  </div>
  <div class="form">
   <div class="group">
    <div class="label">Server:</div>
    <Input placeholder="wss://your_server/" bind:value={credentials.server} onKeydown={keyLogin} />
   </div>
   <div class="group">
    <div class="label">User name:</div>
    <Input placeholder="Administrator's user name" bind:value={credentials.username} onKeydown={keyLogin} />
   </div>
   <div class="group">
    <div class="label">Password:</div>
    <Input type="password" placeholder="Password" bind:value={credentials.password} onKeydown={keyLogin} />
   </div>
   {#if $loginError}
    <Alert text={$loginError} />
   {/if}
   <Button disabled={loggingIn} onClick={clickLogin}>
    {#if loggingIn}
     <Spinner />
    {:else}
     Login
    {/if}
   </Button>
  </div>
 </div>
</div>
