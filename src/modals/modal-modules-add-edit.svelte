<script>
 import { onMount } from 'svelte';
 import { modulesAdd, modulesEdit, modulesInfo } from '../core.js';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Alert from '../components/alert.svelte';
 export let close;
 export let params;
 let id = params?.id;
 let enabled = true;
 let elModuleName;
 let elModuleConnectionString;
 let elModuleEnabled;
 let moduleData = null;
 let error = null;

 onMount(() => {
  if (id) {
   modulesInfo(id, res => {
    moduleData = res?.data;
    enabled = moduleData?.enabled;
    console.log('moduleData:', moduleData, 'enabled:', enabled);
   });
  }
  elModuleName.focus();
 });

 function clickAddEdit(do_close) {
  console.log('clickAddEdit:', do_close);
  const params = [elModuleName.getValue(), elModuleConnectionString.getValue(), elModuleEnabled.checked, async res => await cb(res, do_close)];
  if (id) modulesEdit(id, ...params);
  else modulesAdd(...params);
 }

 async function cb(res, do_close) {
  console.log('cb:', res, do_close);
  if (res?.error === 0) {
   if (do_close) {
    close();
    await params.onSubmit.call();
   }
  } else if (res?.message) error = res.message;
 }

 function keyEnter(event) {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickAddEdit(!event.ctrlKey);
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
 <div><Input value={moduleData ? moduleData.name : ''} placeholder="tld.domain.product" bind:this={elModuleName} onKeydown={keyEnter} /></div>
</div>
<div class="group">
 <div class="label">Connection string:</div>
 <div><Input value={moduleData ? moduleData.connection_string : ''} placeholder="ws://127.0.0.1:25000/" bind:this={elModuleConnectionString} onKeydown={keyEnter} /></div>
</div>
<div class="group">
 <div class="label">Enabled:</div>
 <div><input type="checkbox" bind:checked={enabled} bind:this={elModuleEnabled} /></div>
</div>
<Button text={id ? 'Edit' : 'Add'} onClick={clickAddEdit} />
{#if error}
 <Alert text={error} />
{/if}
