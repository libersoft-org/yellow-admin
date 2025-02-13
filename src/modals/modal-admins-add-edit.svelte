<script>
 import { onMount } from 'svelte';
 import { adminsAdd, adminsEdit, adminInfo } from '../core.js';
 import Spinner from '../components/spinner.svelte';
 import Form from '../components/form.svelte';
 import Group from '../components/form-group.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Alert from '../components/alert.svelte';
 export let close;
 export let params;
 let id = params?.id;
 let elUsername;
 let adminData = null;
 let error = null;
 let loadingForm = false;
 let loadingSubmit = false;
 let form = {};

 onMount(() => {
  if (id) {
   loadingForm = true;
   adminInfo(id, res => {
    adminData = res?.data;
    form = {
     username: adminData?.username ? adminData.username : ''
    };
    loadingForm = false;
   });
  }
  elUsername.focus();
 });

 function clickAddEdit() {
  loadingSubmit = true;
  if (id) adminsEdit(id, form.username, form.password, cb);
  else adminsAdd(form.username, form.password, cb);
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

<Form>
 {#if loadingForm}
  <Spinner />
 {:else}
  <Group label="Admin username">
   <Input bind:value={form.username} placeholder="Username" onKeydown={keyEnter} bind:this={elUsername} />
  </Group>
  <Group label="Password">
   <Input type="password" bind:value={form.password} placeholder="Password" onKeydown={keyEnter} />
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
