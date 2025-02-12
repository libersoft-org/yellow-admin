<script>
 import { onMount } from 'svelte';
 import { adminsAdd, adminsEdit, adminInfo } from '../core.js';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Alert from '../components/alert.svelte';
 export let close;
 export let params;
 let id = params?.id;
 let usernameElement;
 let password;
 let adminData = null;
 let error = null;

 onMount(() => {
  if (id) adminInfo(id, res => (adminData = res?.data));
  usernameElement.focus();
 });

 function clickAddEdit() {
  if (usernameElement.value) {
   if (id) adminsEdit(id, usernameElement.value, password, cb);
   else adminsAdd(usernameElement.value, password, cb);
  }
 }

 async function cb(res) {
  if (res?.error === 0) {
   close();
   await params.onSubmit.call();
  } else if (res?.message) error = res.message;
 }

 function keyEnter(event) {
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
</style>

<div class="group">
 <div class="label">Admin username:</div>
 <div><Input value={adminData ? adminData.username : ''} placeholder="Username" onKeydown={keyEnter} bind:this={usernameElement} /></div>
</div>
<div class="group">
 <div class="label">Password:</div>
 <div><Input type="password" bind:value={password} placeholder="Password" onKeydown={keyEnter} /></div>
</div>
<Button on:click={clickAddEdit} text={id ? 'Edit' : 'Add'} />
{#if error}
 <Alert text={error} />
{/if}
