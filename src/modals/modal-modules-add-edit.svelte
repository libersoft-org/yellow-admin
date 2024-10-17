<script>
 import { onMount } from 'svelte';
 import { modulesAdd, modulesEdit, modulesInfo } from '../core.js';
 import Button from '../components/button.svelte';
 export let onClose;
 export let id = null;
 let moduleElement;
 let moduleData = null;
 let error = null;

 onMount(() => {
  if (id) {
   modulesInfo(id, res => {
    moduleData = res?.data;
   });
  }
  moduleElement.focus();
 });

 function clickAddEdit() {
  if (moduleElement.value) {
   if (id) {
    modulesEdit(id, moduleElement.value, res => {
     if (res?.error === 0) onClose(true);
     else if (res?.message) error = res.message;
    });
   } else {
    modulesAdd(moduleElement.value, res => {
     if (res?.error === 0) onClose(true);
     else if (res?.message) error = res.message;
    });
   }
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
 <div class="label">Module name:</div>
 <div><input type="text" value={moduleData ? moduleData.name : ''} placeholder="tld.domain.product" on:keydown={keyEnter} bind:this={moduleElement} /></div>
 <div><input type="text" value={moduleData ? moduleData.server : ''} placeholder="127.0.0.1" on:keydown={keyEnter} bind:this={moduleElement} /></div>
 <div><input type="text" value={moduleData ? moduleData.port : ''} placeholder="25000" on:keydown={keyEnter} bind:this={moduleElement} /></div>
 <Button on:click={clickAddEdit} text={id ? 'Edit' : 'Add'} />
</div>
{#if error}
 <div class="error">
  <div class="bold">Error:</div>
  <div>{error}</div>
 </div>
{/if}
