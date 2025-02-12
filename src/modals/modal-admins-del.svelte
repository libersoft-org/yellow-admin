<script>
 import { adminsDel } from '../core.js';
 import Button from '../components/button.svelte';
 import Alert from '../components/alert.svelte';
 export let close;
 export let params;
 let id = params?.id;
 let name = params?.name;
 let error = null;

 function clickDel() {
  adminsDel(id, cb);
 }

 async function cb(res) {
  if (res?.error === 0) {
   close();
   await params.onSubmit.call();
  } else if (res?.message) error = res.message;
 }
</script>

<div>Would you like to delete the admin "<span class="bold">{name}</span>" (id: {id})?</div>
<Button on:click={clickDel} text="Delete" />
{#if error}
 <Alert text={error} />
{/if}
