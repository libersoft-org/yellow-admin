<script>
 import { sessionsDel } from '../core.js';
 import Button from '../components/button.svelte';
 export let onClose;
 export let id;
 export let session;
 let error = null;

 function clickDel() {
  sessionsDel(session, res => {
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

<div>Would you like to delete the session "<span class="bold">{session}</span>" (id: {id})?</div>
<Button on:click={clickDel} text="Delete" />
{#if error}
 <div class="error">
  <div class="bold">Error:</div>
  <div>{error}</div>
 </div>
{/if}
