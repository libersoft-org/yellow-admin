<script>
 import { onMount } from 'svelte';
 import { usersAdd, usersEdit, userInfo, domainsList } from '../core.js';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Select from '../components/select.svelte';
 import Option from '../components/select-option.svelte';
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
    if (res.error === 0) domains = res.data.domains;
   },
   1000000,
   0,
   null,
   'id',
   'ASC'
  );
  if (id)
   userInfo(id, res => {
    userData = res?.data;
   });
  usernameElement.focus();
 });

 function clickAddEdit() {
  console.log('asdfjkkjdjkadfjklsdflkjsdfljksdfjkl');
  error = null;

  if (!usernameElement.getValue()) {
   error = 'Username is required';
   return;
  }
  if (!domainElement.value) {
   error = 'Domain is required';
   return;
  }

  if (id) usersEdit(id, usernameElement.getValue(), domainElement.value, visibleNameElement.value, passwordElement.value, cb);
  else usersAdd(usernameElement.value, domainElement.value, visibleNameElement.value, passwordElement.value, cb);
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
 <div class="label">Username:</div>
 <div><Input value={userData ? userData.username : ''} placeholder="Username" onKeydown={keyEnter} bind:this={usernameElement} /></div>
</div>
<div class="group">
 <div class="label">Domain:</div>
 <div>
  <Select bind:this={domainElement} value={userData ? userData.id_domains : ''}>
   <Option text="--- domain ---" selected={true} disabled={true} />
   {#each domains as d (d.id)}
    <Option value={d.id} text={d.name} />
   {/each}
  </Select>
 </div>
</div>
<div class="group">
 <div class="label">Visible name:</div>
 <div><Input bind:this={visibleNameElement} value={userData ? userData.visible_name : ''} placeholder="Visible name" onKeydown={keyEnter} /></div>
</div>
<div class="group">
 <div class="label">Password:</div>
 <div><Input type="password" bind:this={passwordElement} placeholder="Password" onKeydown={keyEnter} /></div>
</div>
<Button on:click={clickAddEdit} text={id ? 'Edit' : 'Add'} />
{#if error}
 <div class="error">
  <div class="bold">Error:</div>
  <div>{error}</div>
 </div>
{/if}
