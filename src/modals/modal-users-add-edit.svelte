<script>
 import { onMount } from 'svelte';
 import { usersAdd, usersEdit, userInfo, domainsList } from '../core.js';
 import Button from '../components/button.svelte';

 export let close;
 export let params;

 let id = params?.id;
 let usernameElement;
 let domains = [];
 let domainElement;
 let visibleNameElement;
 let passwordElement;
 let userData = null;
 let error = null;

 onMount(() => {
  domainsList(
   res => {
    if (res.error === 0) domains = [{ id: null, name: '--- domain ---' }, ...res.data.domains];
   },
   1000000,
   0,
   null,
   'id',
   'ASC'
  );
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
    usersEdit(id, usernameElement.value, domainElement.value, visibleNameElement.value, passwordElement.value, cb);
   } else {
    usersAdd(usernameElement.value, domainElement.value, visibleNameElement.value, passwordElement.value, cb);
   }
  }
 }

 async function cb(res) {
  if (res?.error === 0) {
   close();
   await params.onSubmit();
  }
  else if (res?.message) error = res.message;
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
  <select bind:this={domainElement} value={userData ? userData.id_domains : ''}>
   {#each domains as d (d.id)}
    <option value={d.id}>{d.name}</option>
   {/each}
  </select>
 </div>
</div>
<div class="group">
 <div class="label">Visible name:</div>
 <div><input type="text" bind:this={visibleNameElement} value={userData ? userData.visible_name : ''} placeholder="Visible name" on:keydown={keyEnter} /></div>
</div>
<div class="group">
 <div class="label">Password:</div>
 <div><input type="password" bind:this={passwordElement} placeholder="Password" on:keydown={keyEnter} /></div>
</div>
<Button on:click={clickAddEdit} text={id ? 'Edit' : 'Add'} />
{#if error}
 <div class="error">
  <div class="bold">Error:</div>
  <div>{error}</div>
 </div>
{/if}
