<script>
 import { onMount, tick } from 'svelte';
 import { domainsAdd, domainsEdit, domainInfo } from '../core.js';
 import Spinner from '../components/spinner.svelte';
 import Form from '../components/form.svelte';
 import Group from '../components/form-group.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Alert from '../components/alert.svelte';
 export let close;
 export let params;
 let id = params?.id;
 let elDomain;
 let domainData = null;
 let error = null;
 let loadingForm = false;
 let loadingSubmit = false;
 let form = {};

 onMount(async () => {
  if (id) {
   loadingForm = true;
   domainInfo(id, async res => {
    domainData = res?.data;
    form = {
     name: domainData?.name ? domainData.name : ''
    };
    loadingForm = false;
    await tick();
    elDomain?.focus();
   });
  }
  await tick();
  elDomain?.focus();
 });

 function clickAddEdit() {
  loadingSubmit = true;
  if (id) domainsEdit(id, form.name, cb);
  else domainsAdd(form.name, cb);
 }

 async function cb(res) {
  if (res?.error === false) {
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

<Form>
 {#if loadingForm}
  <Spinner />
 {:else}
  <Group label="Domain name">
   <Input placeholder="domain.tld" onKeydown={keyEnter} bind:this={elDomain} bind:value={form.name} />
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
