<script>
 import { onMount, tick } from 'svelte';
 import { usersAdd, usersEdit, userInfo, domainsList } from '../core.js';
 import Spinner from '../components/spinner.svelte';
 import Form from '../components/form.svelte';
 import Group from '../components/form-group.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Select from '../components/select.svelte';
 import Option from '../components/select-option.svelte';
 import Alert from '../components/alert.svelte';
 export let close;
 export let params;
 export let reposition;
 let id = params?.id;
 let elUsername;
 let domains = [];
 let userData = null;
 let error = null;
 let loadingForm = false;
 let loadingSubmit = false;
 let form = {};

 onMount(async () => {
  domainsList(
   res => {
    if (res.error === false) domains = res.data.domains;
   },
   1000000,
   0,
   null,
   'id',
   'ASC'
  );
  if (id) {
   loadingForm = true;
   userInfo(id, async res => {
    userData = res?.data;
    form = {
     username: userData?.username ? userData.username : '',
     idDomains: userData?.id_domains ? userData.id_domains : '',
     visibleName: userData?.visible_name ? userData.visible_name : ''
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
  if (id) usersEdit(id, form.username, form.idDomains, form.visibleName, form.password, cb);
  else usersAdd(form.username, form.idDomains, form.visibleName, form.password, cb);
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
  <Group label="Username">
   <Input data-testid="user-form-username" bind:value={form.username} placeholder="Username" onKeydown={keyEnter} bind:this={elUsername} />
  </Group>
  <Group label="Domain">
   <Select data-testid="user-form-domain" grow={true} bind:value={form.idDomains}>
    <Option text="--- domain ---" selected={true} disabled={true} />
    {#each domains as d (d.id)}
     <Option value={d.id} text={d.name} />
    {/each}
   </Select>
  </Group>
  <Group label="Visible name">
   <Input data-testid="user-form-visible-name" bind:value={form.visibleName} placeholder="Visible name" onKeydown={keyEnter} />
  </Group>
  <Group label="Password">
   <Input data-testid="user-form-password" type="password" bind:value={form.password} placeholder="Password" onKeydown={keyEnter} />
  </Group>
  {#if error}
   <Alert text={error} />
  {/if}
  <Button data-testid="user-form-submit" enabled={!loadingSubmit} onClick={clickAddEdit}>
   {#if loadingSubmit}
    <Spinner />
   {:else}
    {id ? 'Edit' : 'Add'}
   {/if}
  </Button>
 {/if}
</Form>
