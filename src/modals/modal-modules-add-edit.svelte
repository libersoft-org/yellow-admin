<script>
 import { onMount } from 'svelte';
 import { modulesAdd, modulesEdit, modulesInfo } from '../core.js';
 import Spinner from '../components/spinner.svelte';
 import Form from '../components/form.svelte';
 import Group from '../components/form-group.svelte';
 import Switch from '../components/switch.svelte';
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
 let loadingForm = false;
 let loadingSubmit = false;

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

<Form>
 {#if loadingForm}
  <Spinner />
 {:else}
  <Group label="Module name">
   <Input value={moduleData ? moduleData.name : ''} placeholder="tld.domain.product" bind:this={elModuleName} onKeydown={keyEnter} />
  </Group>
  <Group label="Connection string">
   <Input value={moduleData ? moduleData.connection_string : ''} placeholder="ws://127.0.0.1:25000/" bind:this={elModuleConnectionString} onKeydown={keyEnter} />
  </Group>
  <Group label="Enabled">
   <Switch bind:checked={enabled} bind:this={elModuleEnabled} />
  </Group>
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
</Form>
