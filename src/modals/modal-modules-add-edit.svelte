<script>
 import { onMount, tick } from 'svelte';
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
 export let reposition;
 let id = params?.id;
 let enabled = true;
 let elModuleName;
 let moduleData = null;
 let error = null;
 let loadingForm = false;
 let loadingSubmit = false;
 let form = {};

 onMount(async () => {
  if (id) {
   loadingForm = true;
   modulesInfo(id, async res => {
    moduleData = res?.data;
    form = {
     name: moduleData?.name ? moduleData.name : '',
     connectionString: moduleData?.connection_string ? moduleData.connection_string : '',
     enabled: moduleData?.enabled ? (moduleData.enabled === 1 ? true : false) : false
    };
    loadingForm = false;
    await tick();
    elModuleName?.focus();
    await reposition();
   });
  }
  await tick();
  elModuleName?.focus();
 });

 function clickAddEdit(do_close) {
  const params = [form.name, form.connectionString, form.enabled, async res => await cb(res, do_close)];
  if (id) modulesEdit(id, ...params);
  else modulesAdd(...params);
 }

 async function cb(res, do_close) {
  console.log('cb:', res, do_close);
  if (res?.error === false) {
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
   <Input data-testid="module-form-name" bind:value={form.name} placeholder="tld.domain.product" bind:this={elModuleName} onKeydown={keyEnter} />
  </Group>
  <Group label="Connection string">
   <Input data-testid="module-form-connection" bind:value={form.connectionString} placeholder="ws://127.0.0.1:25000/" onKeydown={keyEnter} />
  </Group>
  <Group label="Enabled">
   <Switch data-testid="module-form-enabled" bind:checked={form.enabled} />
  </Group>
  {#if error}
   <Alert text={error} />
  {/if}
  <Button data-testid="module-form-submit" enabled={!loadingSubmit} onClick={clickAddEdit}>
   {#if loadingSubmit}
    <Spinner />
   {:else}
    {id ? 'Edit' : 'Add'}
   {/if}
  </Button>
 {/if}
</Form>
