<script>
 import { onMount } from 'svelte';
 import { modulesAdd, modulesEdit, modulesInfo } from '../core.js';
 import Button from '../components/button.svelte';
 export let onClose;
 export let id = null;
 let elModuleName;
 let elModuleServer;
 let elModulePort;
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
  const callback = res => {
   if (res?.error === 0) onClose(true);
   else if (res?.message) error = res.message;
  };
  const params = [elModuleName.value, elModuleServer.value, elModulePort.value, callback];
  if (id) modulesEdit(id, ...params);
  else modulesAdd(...params);
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
 <div class="label">Server address:</div>
 <div><input type="text" value={moduleData ? moduleData.server : ''} placeholder="127.0.0.1" on:keydown={keyEnter} bind:this={elModuleServer} /></div>
</div>
<div class="group">
 <div class="label">Server port:</div>
 <div><input type="text" value={moduleData ? moduleData.port : ''} placeholder="25000" on:keydown={keyEnter} bind:this={elModulePort} /></div>
</div>
<Button on:click={clickAddEdit} text={id ? 'Edit' : 'Add'} />
{#if error}
 <div class="error">
  <div class="bold">Error:</div>
  <div>{error}</div>
 </div>
{/if}
