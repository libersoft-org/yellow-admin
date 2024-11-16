<script>
 import { onMount } from 'svelte';
 import { modulesAdd, modulesEdit, modulesInfo } from '../core.js';
 import Button from '../components/button.svelte';

 export let close;
 export let params;

 let id = params?.id;
 let elModuleName;
 let elModuleConnectionString;
 let moduleData = null;
 let error = null;

 onMount(() => {
  if (id) {
   modulesInfo(id, res => {
    moduleData = res?.data;
   });
  }
  elModuleName.focus();
 });

 function clickAddEdit() {
  const params = [elModuleName.value, elModuleConnectionString.value, cb];
  if (id) modulesEdit(id, ...params);
  else modulesAdd(...params);
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
 <div class="label">Module name:</div>
 <div><input type="text" value={moduleData ? moduleData.name : ''} placeholder="tld.domain.product" on:keydown={keyEnter} bind:this={elModuleName} /></div>
</div>
<div class="group">
 <div class="label">Connection string:</div>
 <div><input type="text" value={moduleData ? moduleData.connection_string : ''} placeholder="ws://127.0.0.1:25000/" on:keydown={keyEnter} bind:this={elModuleConnectionString} /></div>
</div>
<Button on:click={clickAddEdit} text={id ? 'Edit' : 'Add'} />
{#if error}
 <div class="error">
  <div class="bold">Error:</div>
  <div>{error}</div>
 </div>
{/if}
