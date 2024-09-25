<script>
 import { onMount } from 'svelte';
 import { usersAdd, usersEdit, userInfo } from '../core.js';
 import Button from '../components/button.svelte';
 export let onClose;
 export let id = null;
 let usernameElement;
 let domain;
 let visibleName;
 let password;
 let userData = null;
 let error = null;

 onMount(() => {
  if (id) {
   userInfo(id, res => {
    userData = res?.data;
   });
  }
  usernameElement.focus();
 });

 function clickAddEdit() {
  if (usernameElement.value) {
   if (id) {
    usersEdit(id, usernameElement.value, password, res => {
     if (res?.error === 0) onClose(true);
     else if (res?.message) error = res.message;
    });
   } else {
    usersAdd(usernameElement.value, password, res => {
     if (res?.error === 0) onClose(true);
     else if (res?.message) error = res.message;
    });
   }
  }
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
 <div class="label">Username:</div>
 <div><input type="text" value={userData ? userData.username : ''} placeholder="Username" on:keydown={keyEnter} bind:this={usernameElement} /></div>
</div>
<div class="group">
 <div class="label">Domain:</div>
 <div>
  <select bind:value={domain}>
   <option value="aaa">bbb</option>
  </select>
 </div>
</div>
<div class="group">
 <div class="label">Visible name:</div>
 <div><input type="text" bind:value={visibleName} placeholder="Visible name" on:keydown={keyEnter} /></div>
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
