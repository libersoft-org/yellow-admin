<script>
 import { hideSidebarMobile, domainsList } from '../core.js';
 import SortableColumnHeader from '../components/sortable-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Button from '../components/button.svelte';
 import Modal from '../components/modal.svelte';
 import ModalDomainsAdd from '../modals/modal-domains-add-edit.svelte';
 import ModalDomainsDel from '../modals/modal-domains-del.svelte';
 export let contentElement;
 let items = [];
 let isModalAddEditOpen = false;
 let isModalDelOpen = false;
 let domainID = null;
 let domainName = null;
 let filterName = null;

 let filterOffset = 0;

 let lazyLoader;
 let sortBy = 'id';
 let sortDir = 'asc';


 function reloadItems() {
  lazyLoader.reload(filterName, filterOffset - 1);
 }

 async function loadItems(show_items_callback, count, offset, filterName = null) {
  console.log('loadItems count:', count, 'offset:', offset, 'filterName:', filterName, 'sortBy:', sortBy, 'sortDir:', sortDir);
  domainsList(res => show_items_callback({error: res.error, items: res.data.domains}), count, offset, filterName, sortBy, sortDir);
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


 function onModalAddEditClose(reload = false) {
  isModalAddEditOpen = false;
  if (reload) {
   reloadItems();
  }
 }

 function clickSearch() {
  console.log('search');
  reloadItems();
 }

 function clickReload() {
  filterName = null;
  filterOffset = 0;
  reloadItems();
 }

 function keySearchForm() {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickSearch();
  }
 }

 function keySortBy(columnName) {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickSortBy(columnName);
  }
 }

 function onModalDelClose(reload = false) {
  isModalDelOpen = false;
  reloadItems();
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
 .search {
  display: flex;
  align-items: center;
  gap: 10px;
 }
</style>

<div class="page">
 <div class="buttons">

  <div class="menu-button" role="button" tabindex="0" on:click={clickMenu} on:keydown={keyMenu} >
   <img src="img/menu.svg" alt="☰" />
  </div>

  <Button on:click={() => clickAddEdit()} img="img/add.svg" text="Add a new domain" />
  <Button on:click={() => clickReload()} img="img/reload.svg" text="Reload" />

 </div>
 <div class="buttons">
  <div class="search">
   <div>Domain name:</div>
   <input type="text" placeholder="domain.tld" bind:value={filterName} on:keydown={keySearchForm}>
  </div>
  <div class="search">
   <div>Offset:</div>
   <input type="number" min="0" placeholder="0" bind:value={filterOffset} on:keydown={keySearchForm}>
  </div>
  <Button on:click={clickSearch} img="img/search.svg" text="Search" />
 </div>
 <table class="list-table">
  <thead>
   <tr>
    <SortableColumnHeader column="id" name="ID" bind:sortBy={sortBy} bind:sortDir={sortDir} sortingChanged={() => reloadItems()} />
    <SortableColumnHeader column="name" name="Name" bind:sortBy={sortBy} bind:sortDir={sortDir} sortingChanged={() => reloadItems()} />
    <SortableColumnHeader column="users_count" name="Number of users" bind:sortBy={sortBy} bind:sortDir={sortDir} sortingChanged={() => reloadItems()} />
    <SortableColumnHeader column="created" name="Created" bind:sortBy={sortBy} bind:sortDir={sortDir} sortingChanged={() => reloadItems()} />
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
      <div class="row">
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
