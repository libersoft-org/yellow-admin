<script>
 import { domainsDel } from '../core.js';
 export let onClose;
 export let id;
 export let name;
 let error = null;
 
 function clickDel() {
  domainsDel(id, (res) => {
   if (res?.error === 0) onClose(true);
   else if (res?.message) error = res.message;
  });
 }

 function keyDel() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickDel();
  }
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

<div>Would you like to delete the domain "<span class="bold">{name}</span>" (id: {id})?</div>
<div class="button" role="button" tabindex="0" on:click={clickDel} on:keydown={keyDel}>Delete</div>
{#if error}
 <div class="error">
  <div class="bold">Error:</div>
  <div>{error}</div>
 </div>
{/if}
