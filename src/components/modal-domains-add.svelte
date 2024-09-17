<script>
 import { onMount } from 'svelte';
 import { domainsAdd } from '../core.js';
 export let onClose;
 let domain;
 let error = null;
 onMount(() => domain.focus());

 function clickAdd() {
  if (domain.value) {
   domainsAdd(domain.value, (res) => {
    if (res?.error === 0) onClose(true);
    else if (res?.message) error = res.message;
   });
  }
 }

 function keyAdd() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickAdd();
  }
 }

 function keyEnter() {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickAdd();
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
 <div><input type="text" placeholder="domain.tld" on:keydown={keyEnter} bind:this={domain} /></div>
 <div class="button" role="button" tabindex="0" on:click={clickAdd} on:keydown={keyAdd}>Add</div>
</div>
{#if error}
 <div class="error">
  <div class="bold">Error:</div>
  <div>{error}</div>
 </div>
{/if}
