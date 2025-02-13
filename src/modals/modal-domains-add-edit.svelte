<script>
 import { onMount } from 'svelte';
 import { domainsAdd, domainsEdit, domainInfo } from '../core.js';
 import Form from '../components/form.svelte';
 import Group from '../components/form-group.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Alert from '../components/alert.svelte';
 export let close;
 export let params;
 let id = params?.id;
 let domainElement;
 let domainData = null;
 let error = null;
 let name = '';
 let button_disabled = false;

 $: button_disabled = !name;

 onMount(() => {
  if (id) {
   domainInfo(id, res => {
    domainData = res?.data;
    name = domainData ? domainData.name : '';
   });
  }
  domainElement.focus();
 });

 function clickAddEdit() {
  console.log('clickAddEdit');
  if (domainElement.value) {
   if (id) domainsEdit(id, domainElement.value, cb);
   else domainsAdd(domainElement.value, cb);
  } else console.log('domainElement.value is empty');
 }

 function keyEnter(event) {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickAddEdit();
  }
 }

 async function cb(res) {
  if (res?.error === 0) {
   close();
   await params.onSubmit.call();
  } else if (res?.message) error = res.message;
 }
</script>

<Form>
 <Group label="Domain name">
  <Input placeholder="domain.tld" onKeydown={keyEnter} bind:this={domainElement} bind:value={name} />
 </Group>
 <Button text={id ? 'Edit' : 'Add'} disabled={button_disabled} onClick={clickAddEdit} />
 {#if error}
  <Alert text={error} />
 {/if}
</Form>
