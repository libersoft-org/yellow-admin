<script>
 import { onMount } from 'svelte';
 import { domainsArray, domainsList } from '../../core.js';

 onMount(() => domainsList());

 function clickAdd() {
  // TODO
  console.log('ADD');
 }

 function keyAdd() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickAdd();
  }
 }

 function clickEdit(id) {
  // TODO
  console.log('EDIT', id);
 }

 function keyEdit(id) {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickEdit(id);
  }
 }

 function clickDel(id) {
  // TODO
  console.log('DEL', id);
 }

 function keyDel(id) {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickDel(id);
  }
 }
</script>

<style>
</style>

<div class="page">
 <div class="button" role="button" tabindex="0" on:click={clickAdd} on:keydown={keyAdd}>
  <img src="img/add.svg" alt="Add a new domain" />
  <div>Add a new domain</div>
 </div>
 <table>
  <thead>
   <tr>
    <th>ID</th>
    <th>Name</th>
    <th>Created</th>
    <th>Action</th>
   </tr>
  </thead>
  <tbody>
   {#each $domainsArray as d}
    <tr>
     <td>{d.id}</td>
     <td>{d.name}</td>
     <td>{new Date(d.created.replace(' ', 'T') + 'Z').toLocaleString()}</td>
     <td>
      <div class="icons">
       <div class="icon" role="button" tabindex="0" on:click={() => clickEdit(d.id)} on:keydown={() => keyEdit(d.id)}><img src="img/edit.svg" alt="Edit" /></div>
       <div class="icon" role="button" tabindex="0" on:click={() => clickDel(d.id)} on:keydown={() => keyEdit(d.id)}><img src="img/del.svg" alt="Delete" /></div>
      </div>
     </td>
    </tr>
   {/each}
  </tbody>
 </table>
</div>
