<script>
 import { onMount } from 'svelte';
 import { usersAdd, usersEdit, userInfo, domainsList } from '../core.js';
 import Spinner from '../components/spinner.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Select from '../components/select.svelte';
 import Option from '../components/select-option.svelte';
 import Alert from '../components/alert.svelte';
 export let close;
 export let params;
 let id = params?.id;
 let elUsername;
 let domains = [];
 let userData = null;
 let error = null;
 let loadingForm = false;
 let loadingSubmit = false;
 let form = {};

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
  if (id) {
   loadingForm = true;
   userInfo(id, res => {
    userData = res?.data;
    form = {
     username: userData?.username ? userData.username : '',
     idDomains: userData?.id_domains ? userData.id_domains : '',
     visibleName: userData?.visible_name ? userData.visible_name : ''
    };
    loadingForm = false;
   });
  }
  elUsername.focus();
 });

 function clickAddEdit() {
  loadingSubmit = true;
  if (id) usersEdit(id, form.username, form.idDomains, form.visibleName, form.password, cb);
  else usersAdd(form.username, form.idDomains, form.visibleName, form.password, cb);
 }

 async function cb(res) {
  if (res?.error === 0) {
   close();
   await params.onSubmit.call();
  } else if (res?.message) error = res.message;
  loadingSubmit = false;
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
 {#if loadingForm}
  <Spinner />
 {:else}
  <div class="group">
   <div class="label">Username:</div>
   <Input bind:value={form.username} placeholder="Username" onKeydown={keyEnter} bind:this={elUsername} />
  </div>
  <div class="group">
   <div class="label">Domain:</div>
   <Select grow={true} bind:value={form.idDomains}>
    <Option text="--- domain ---" selected={true} disabled={true} />
    {#each domains as d (d.id)}
     <Option value={d.id} text={d.name} />
    {/each}
   </Select>
  </div>
  <div class="group">
   <div class="label">Visible name:</div>
   <Input bind:value={form.visibleName} placeholder="Visible name" onKeydown={keyEnter} />
  </div>
  <div class="group">
   <div class="label">Password:</div>
   <Input type="password" bind:value={form.password} placeholder="Password" onKeydown={keyEnter} />
  </div>
  {#if error}
   <Alert text={error} />
  {/if}
  <Button enabled={!loadingSubmit} onClick={clickAddEdit}>
   {#if loadingSubmit}
    <Spinner />
   {:else}
    {id ? 'Edit' : 'Add'}
   {/if}
  </Button>
 {/if}
</div>
