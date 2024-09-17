<script>
 import { onMount } from 'svelte';
 //import { openNewConversation } from '../messages.js';
 //export let onClose;
 let username;
 let domain;

 onMount(() => username.focus());

 function clickAdd() {
  if (username.value) {
   //openNewConversation(address.value);
   //onClose();
  }
 }

 function keyAdd() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickAdd();
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
 <div class="label">Domain:</div>
 <div><select name="domain" on:keydown={keyEnter} bind:this={domain}></select></div>
</div>
<div class="button" role="button" tabindex="0" on:click={clickAdd} on:keydown={keyAdd}>Add</div>
