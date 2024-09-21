<script>
 import { onMount } from 'svelte';
 import Button from '../components/button.svelte';
 //import { openNewConversation } from '../messages.js';
 //export let onClose;
 let username;
 let password;

 onMount(() => username.focus());

 function clickAdd() {
  if (username.value) {
   //openNewConversation(address.value);
   //onClose();
  }
 }

 function keyEnter() {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickAdd();
  }
 }
</script>

<style>
 .group {
  display: flex;
  align-items: center;
  gap: 10px;
 }

 .group .label {
  font-size: 15px;
  padding-left: 5px;
  font-weight: bold;
 }
</style>

<div class="group">
 <div class="label">User name:</div>
 <div><input type="text" placeholder="john.smith" on:keydown={keyEnter} bind:this={username} /></div>
</div>
<div class="group">
 <div class="label">Password:</div>
 <div><input type="password" placeholder="v3ry_$3cr3t_p455w0rd_123" on:keydown={keyEnter} bind:this={password} /></div>
</div>
<Button on:click={clickAdd} text="Add" />
