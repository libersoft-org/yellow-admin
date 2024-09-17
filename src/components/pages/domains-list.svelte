<script>
 import { onMount } from 'svelte';
 import { hideSidebarMobile, domainsArray, domainsList } from '../../core.js';
 import Modal from '../modal.svelte';
 import ModalDomainsAdd from '../modal-domains-add.svelte';
 let isModalAddOpen = false;

 onMount(() => domainsList());

 function clickMenu() {
  hideSidebarMobile.set(false);
 }

 function keyMenu() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickMenu();
  }
 }

 function clickAdd() {
  // TODO
  console.log('ADD');
  isModalAddOpen = true;
 }

 function keyAdd() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickAdd();
  }
 }

 function onModalAddClose(reload = false) {
  isModalAddOpen = false;
  if (reload) domainsList();
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
 <div class="buttons">
  <div class="menu-button" role="button" tabindex="0" on:click={clickMenu} on:keydown={keyMenu}>
   <img src="img/menu.svg" alt="☰" />
  </div>
  <div class="button" role="button" tabindex="0" on:click={clickAdd} on:keydown={keyAdd}>
   <img src="img/add.svg" alt="Add a new domain" />
   <div>Add a new domain</div>
  </div>
 </div>
 <table>
  <thead>
   <tr>
    <th class="center">ID</th>
    <th>Name</th>
    <th class="center">Number of users</th>
    <th class="center">Created</th>
    <th class="center">Action</th>
   </tr>
  </thead>
  <tbody>
   {#each $domainsArray as d}
    <tr>
     <td class="center">{d.id}</td>
     <td>{d.name}</td>
     <td class="center">{d.users_count}</td>
     <td class="center">{new Date(d.created.replace(' ', 'T') + 'Z').toLocaleString()}</td>
     <td class="center">
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
{#if isModalAddOpen}
 <Modal title="Add a new domain" onClose={onModalAddClose}>
  <ModalDomainsAdd onClose={onModalAddClose} />
 </Modal>
{/if}