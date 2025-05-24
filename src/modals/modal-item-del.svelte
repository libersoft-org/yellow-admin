<script>
 import Form from '../components/form.svelte';
 import Button from '../components/button.svelte';
 import Alert from '../components/alert.svelte';
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
  if (res?.error === false) {
   close();
   await params.onSubmit.call();
  } else if (res?.message) error = res.message;
 }
</script>

<Form>
 <div>Would you like to delete "<span class="bold">{name}</span>" (id: {id})?</div>
 <Button data-testid="delete-confirm-button" text="Delete" onClick={clickDel} />
 {#if error}
  <Alert text={error} />
 {/if}
</Form>
