<script>
 import { onMount, tick } from 'svelte';
 import { adminsAdd, adminsEdit, adminInfo } from '../core.js';
 import Spinner from '../components/spinner.svelte';
 import Form from '../components/form.svelte';
 import Group from '../components/form-group.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Alert from '../components/alert.svelte';
 export let close;
 export let params;
 export let reposition;
 let id = params?.id;
 let elUsername;
 let adminData = null;
 let error = null;
 let loadingForm = false;
 let loadingSubmit = false;
 let form = {};

 onMount(async () => {
  if (id) {
   loadingForm = true;
   adminInfo(id, async res => {
    adminData = res?.data;
    form = {
     username: adminData?.username ? adminData.username : ''
    };
    loadingForm = false;
    await tick();
    elUsername?.focus();
    await reposition();
   });
  }
  await tick();
  elUsername?.focus();
 });

 function clickAddEdit() {
  loadingSubmit = true;
  if (id) adminsEdit(id, form.username, form.password, cb);
  else adminsAdd(form.username, form.password, cb);
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
  <Group label="Admin username">
   <Input data-testid="admin-form-username" bind:value={form.username} placeholder="Username" onKeydown={keyEnter} bind:this={elUsername} />
  </Group>
  <Group label="Password">
   <Input data-testid="admin-form-password" type="password" bind:value={form.password} placeholder="Password" onKeydown={keyEnter} />
  </Group>
  {#if error}
   <Alert text={error} />
  {/if}
  <Button data-testid="admin-form-submit" enabled={!loadingSubmit} onClick={clickAddEdit}>
   {#if loadingSubmit}
    <Spinner />
   {:else}
    {id ? 'Edit' : 'Add'}
   {/if}
  </Button>
 {/if}
</Form>
