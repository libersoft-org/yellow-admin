<script>
 import { hideSidebarMobile, domainsList } from '../../core.js';
 import Modal from '../modal.svelte';
 import ModalDomainsAdd from '../modal-domains-add-edit.svelte';
 import ModalDomainsDel from '../modal-domains-del.svelte';
 import LazyLoader from '../lazy-loader.svelte';
 export let contentElement;
 let items = [];
 let isModalAddEditOpen = false;
 let isModalDelOpen = false;
 let domainID = null;
 let domainName = null;
 let lazyLoader;

 async function loadItems(cb, count, offset) {
  domainsList(res => {
   cb({error: res.error, items: res.data.domains});
  }, count, offset);
 }

 function clickMenu() {
  hideSidebarMobile.set(false);
 }

 function keyMenu() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickMenu();
  }
 }

 function clickAddEdit(id = null) {
  domainID = id;
  isModalAddEditOpen = true;
 }

 function keyAddEdit(id = null) {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickAddEdit(id);
  }
 }

 function onModalAddEditClose(reload = false) {
  isModalAddEditOpen = false;
  if (reload) {
   resetTable();
   showTable();
  }
 }

 function keyReload() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   lazyLoader.reload();
  }
 }

 function onModalDelClose(reload = false) {
  isModalDelOpen = false;
  if (reload) {
   lazyLoader.reset();
  }
 }

 function clickDel(id, name) {
  domainID = id;
  domainName = name;
  isModalDelOpen = true;
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
  <div class="button" role="button" tabindex="0" on:click={() => clickAddEdit()} on:keydown={() => keyAddEdit()}>
   <img src="img/add.svg" alt="Add a new domain" />
   <div>Add a new domain</div>
  </div>
  <div class="button" role="button" tabindex="0" on:click={lazyLoader.reload()} on:keydown={keyReload}>
   <img src="img/reload.svg" alt="Reload" />
   <div>Reload</div>
  </div>
 </div>
 <table class="list-table">
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
   {#each items as d}
    <tr>
     <td class="center">{d.id}</td>
     <td>{d.name}</td>
     <td class="center">{d.users_count}</td>
     <td class="center">{new Date(d.created.replace(' ', 'T') + 'Z').toLocaleString()}</td>
     <td class="center">
      <div class="icons">
       <div class="icon" role="button" tabindex="0" on:click={() => clickAddEdit(d.id)} on:keydown={() => keyAddEdit(d.id)}><img src="img/edit.svg" alt="Edit" /></div>
       <div class="icon" role="button" tabindex="0" on:click={() => clickDel(d.id, d.name)} on:keydown={() => keyDel(d.id)}><img src="img/del.svg" alt="Delete" /></div>
      </div>
     </td>
    </tr>
   {/each}
  </tbody>
 </table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items={items} />
</div>
{#if isModalAddEditOpen}
 <Modal title={domainID ? 'Edit the domain' : 'Add a new domain'} onClose={onModalAddEditClose}>
  <ModalDomainsAdd id={domainID} onClose={onModalAddEditClose} />
 </Modal>
{/if}
{#if isModalDelOpen}
 <Modal title="Delete the domain" onClose={onModalDelClose}>
  <ModalDomainsDel id={domainID} name={domainName} onClose={onModalDelClose} />
 </Modal>
{/if}
