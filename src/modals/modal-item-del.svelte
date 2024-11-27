<script>
 import Button from '../components/button.svelte';

 export let close;
 export let params;

 let name = params?.name;
 let id = params?.id;
 let fn = params?.fn;
 let error = null;

 function clickDel() {
  fn(id, cb);
 }

 async function cb(res) {
  if (res?.error === 0) {
   close();
   await params.onSubmit.call();
  } else if (res?.message) error = res.message;
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

<div>Would you like to delete "<span class="bold">{name}</span>" (id: {id})?</div>
<Button on:click={clickDel} text="Delete" />
{#if error}
 <div class="error">
  <div class="bold">Error:</div>
  <div>{error}</div>
 </div>
{/if}
