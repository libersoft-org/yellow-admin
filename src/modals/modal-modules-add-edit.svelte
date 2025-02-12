<script>
 import { onMount } from 'svelte';
 import { modulesAdd, modulesEdit, modulesInfo } from '../core.js';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Alert from '../components/alert.svelte';
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
  const params = [elModuleName.getValue(), elModuleConnectionString.getValue(), cb];
  if (id) modulesEdit(id, ...params);
  else modulesAdd(...params);
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
 <div class="label">Module name:</div>
 <div><Input value={moduleData ? moduleData.name : ''} placeholder="tld.domain.product" onKeydown={keyEnter} bind:this={elModuleName} /></div>
</div>
<div class="group">
 <div class="label">Connection string:</div>
 <div><Input value={moduleData ? moduleData.connection_string : ''} placeholder="ws://127.0.0.1:25000/" onKeydown={keyEnter} bind:this={elModuleConnectionString} /></div>
</div>
<Button text={id ? 'Edit' : 'Add'} onClick={clickAddEdit} />
{#if error}
 <Alert text={error} />
{/if}
