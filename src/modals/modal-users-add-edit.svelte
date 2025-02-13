<script>
 import { onMount } from 'svelte';
 import { usersAdd, usersEdit, userInfo, domainsList } from '../core.js';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Select from '../components/select.svelte';
 import Option from '../components/select-option.svelte';
 import Alert from '../components/alert.svelte';
 import { writable } from 'svelte/store';

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
 console.warn("userData ? userData.username : ''", userData ? userData.username : '');
 // let userNameValue = writable(userData ? userData.username : '');
 let userNameValue = userData ? userData.username : '';

 const form = {};

 let loading = false;

 const obj = {
  test: 123,
  deep: {
   test2: 321
  }
 };
 onMount(() => {
  loading = true;
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
  if (id) {
   userInfo(id, res => {
    userData = res?.data;

    form.username = userData ? userData.username : '';
    form.domain = userData ? userData.id_domains : '';
    form.visibleName = userData ? userData.visible_name : '';
    form.password = '';

    console.log('onMount form', form);
    console.log('onMount userNameValue', form.username);
    loading = false;
   });
  }
  usernameElement.focus();
 });

 function clickAddEdit() {
  console.log('form', form);
  console.log('userData', userData);
  console.log('userNameValue', userNameValue);
  console.log('usernameElement.value', usernameElement.value);
  console.log('domainElement.value', domainElement.value);
  // if (id) usersEdit(id, usernameElement.value, domainElement.value, visibleNameElement.value, passwordElement.value, cb);
  // else usersAdd(usernameElement.value, domainElement.value, visibleNameElement.value, passwordElement.value, cb);
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
 .users-add-edit {
  display: flex;
  flex-direction: column;
  gap: 10px;
 }

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

<div class="users-add-edit">
 {#if loading}
  <div>Loading...</div>
 {:else}
  <div class="group">
   <div class="label">Username:</div>
   {form.username}
   <Input bind:value={form.username} placeholder="Username" onKeydown={keyEnter} bind:this={usernameElement} />
  </div>
  <div class="group">
   <div class="label">Domain:</div>
   <Select grow={true} bind:this={domainElement} value={userData ? userData.id_domains : ''}>
    <Option text="--- domain ---" selected={true} disabled={true} />
    {#each domains as d (d.id)}
     <Option value={d.id} text={d.name} />
    {/each}
   </Select>
  </div>
  <div class="group">
   <div class="label">Visible name:</div>
   <Input bind:this={visibleNameElement} value={userData ? userData.visible_name : ''} placeholder="Visible name" onKeydown={keyEnter} />
  </div>
  <div class="group">
   <div class="label">Password:</div>
   <Input type="password" bind:this={passwordElement} placeholder="Password" onKeydown={keyEnter} />
  </div>
  {#if error}
   <Alert text={error} />
  {/if}
  <Button text={id ? 'Edit' : 'Add'} onClick={clickAddEdit} />
 {/if}
</div>
