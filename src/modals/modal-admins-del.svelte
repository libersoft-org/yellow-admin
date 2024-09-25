<script>
 import { adminsDel } from '../core.js';
 import Button from '../components/button.svelte';
 export let onClose;
 export let id;
 export let name;
 let error = null;

 function clickDel() {
  adminsDel(id, res => {
   if (res?.error === 0) onClose(true);
   else if (res?.message) error = res.message;
  });
 }
</script>

<style>
 .error {
  display: flex;
  gap: 5px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f33;
 }
</style>

<div>Would you like to delete the admin "<span class="bold">{name}</span>" (id: {id})?</div>
<Button on:click={clickDel} text="Delete" />
{#if error}
 <div class="error">
  <div class="bold">Error:</div>
  <div>{error}</div>
 </div>
{/if}
