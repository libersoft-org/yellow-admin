<script>
 import { onMount } from 'svelte';
 import { domainsAdd, domainsEdit, domainInfo } from '../core.js';
 import Button from '../components/button.svelte';

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
   if (id) {
    domainsEdit(id, domainElement.value, cb);
   } else {
    domainsAdd(domainElement.value, cb);
   }
  } else {
   console.log('domainElement.value is empty');
  }
 }

 function keyEnter() {
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

<style>
 .group {
  display: flex;
  align-items: center;
  gap: 10px;
 }

 .group .label {
  font-size: 15px;
  padding-left: 5px;
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
 <div class="label">Domain name:</div>
 <div><input type="text" placeholder="domain.tld" on:keydown={keyEnter} bind:this={domainElement} bind:value={name} /></div>
 <Button disabled={button_disabled} on:click={clickAddEdit} text={id ? 'Edit' : 'Add'} />
</div>
{#if error}
 <div class="error">
  <div class="bold">Error:</div>
  <div>{error}</div>
 </div>
{/if}
