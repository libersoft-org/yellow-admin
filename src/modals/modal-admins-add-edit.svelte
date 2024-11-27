<script>
 import { onMount } from 'svelte';
 import { adminsAdd, adminsEdit, adminInfo } from '../core.js';
 import Button from '../components/button.svelte';

 export let close;
 export let params;

 let id = params?.id;
 let usernameElement;
 let password;
 let adminData = null;
 let error = null;

 onMount(() => {
  if (id) {
   adminInfo(id, res => {
    adminData = res?.data;
   });
  }
  usernameElement.focus();
 });

 function clickAddEdit() {
  if (usernameElement.value) {
   if (id) {
    adminsEdit(id, usernameElement.value, password, cb);
   } else {
    adminsAdd(usernameElement.value, password, cb);
   }
  }
 }

 async function cb(res) {
  if (res?.error === 0) {
   close();
   await params.onSubmit.call();
  } else if (res?.message) error = res.message;
 }

 function keyEnter() {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickAddEdit();
  }
 }
</script>

<style>
 .group {
  display: flex;
  flex-direction: column;
  gap: 5px;
 }

 .group .label {
  font-size: 15px;
  font-weight: bold;
 }

 .error {
  display: flex;
  gap: 5px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f33;
 }
</style>

<div class="group">
 <div class="label">Admin username:</div>
 <div><input type="text" value={adminData ? adminData.username : ''} placeholder="Username" on:keydown={keyEnter} bind:this={usernameElement} /></div>
</div>
<div class="group">
 <div class="label">Password:</div>
 <div><input type="password" bind:value={password} placeholder="Password" on:keydown={keyEnter} /></div>
</div>
<Button on:click={clickAddEdit} text={id ? 'Edit' : 'Add'} />
{#if error}
 <div class="error">
  <div class="bold">Error:</div>
  <div>{error}</div>
 </div>
{/if}
