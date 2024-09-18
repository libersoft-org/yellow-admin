<script>
 import { onMount } from 'svelte';
 import { domainsAdd, domainsEdit, domainInfo } from '../core.js';
 export let onClose;
 export let id = null;
 let domainElement;
 let domainData = null;
 let error = null;

 onMount(() => {
  if (id) {
   domainInfo(id, res => {
    domainData = res?.data;
   });
  }
  domainElement.focus();
 });

 function clickAddEdit() {
  if (domainElement.value) {
   if (id) {
    domainsEdit(id, domainElement.value, res => {
     if (res?.error === 0) onClose(true);
     else if (res?.message) error = res.message;
    });
   } else {
    domainsAdd(domainElement.value, res => {
     if (res?.error === 0) onClose(true);
     else if (res?.message) error = res.message;
    });
   }
  }
 }

 function keyAddEdit() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickAddEdit();
  }
 }

 function keyEnter() {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickAddEdit();
  }
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
 <div><input type="text" value={domainData ? domainData.name : ''} placeholder="domain.tld" on:keydown={keyEnter} bind:this={domainElement} /></div>
 <div class="button" role="button" tabindex="0" on:click={clickAddEdit} on:keydown={keyAddEdit}>{id ? 'Edit' : 'Add'}</div>
</div>
{#if error}
 <div class="error">
  <div class="bold">Error:</div>
  <div>{error}</div>
 </div>
{/if}
