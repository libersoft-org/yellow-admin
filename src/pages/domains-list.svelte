<script>
 import { domainsList } from '../core.js';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Button from '../components/button.svelte';
 import Modal from '../components/modal.svelte';
 import ModalDomainsAdd from '../modals/modal-domains-add-edit.svelte';
 import ModalDomainsDel from '../modals/modal-domains-del.svelte';
 import Cell from '../components/table-cell.svelte';
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
 let sortDir = 'ASC';

 function reloadItems() {
  lazyLoader.reload({name: filterName}, filterOffset);
 }

 async function loadItems(show_items_callback, count, offset, filters) {
  console.log('loadItems count:', count, 'offset:', offset, 'sortBy:', sortBy, 'sortDir:', sortDir, 'filter', filters);
  domainsList(res => show_items_callback({ error: res.error, items: res.data.domains }), count, offset, filters?.name, sortBy, sortDir);
 }

 function clickAddEdit(id = null) {
  domainID = id;
  isModalAddEditOpen = true;
 }

 function keyAddEdit(id) {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickAddEdit(id);
  }
 }

 function onModalAddEditClose(reload = false) {
  isModalAddEditOpen = false;
  if (reload) reloadItems();
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

 .row .icon {
  display: flex;
  padding: 5px;
  cursor: pointer;
 }

 .row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
 }

 .row .icon img {
  width: 20px;
  height: 20px;
 }
</style>

<div class="page">
 <div class="buttons">
  <MenuButton />
  <Button on:click={() => clickAddEdit()} img="img/add.svg" text="Add a new domain" />
  <Button on:click={() => clickReload()} img="img/reload.svg" text="Reload" />
 </div>
 <div class="buttons">
  <div class="search">
   <div>Domain name:</div>
   <input type="text" placeholder="domain.tld" bind:value={filterName} on:keydown={keySearchForm} />
  </div>
  <div class="search">
   <div>Offset:</div>
   <input type="number" min="0" placeholder="0" bind:value={filterOffset} on:keydown={keySearchForm} />
  </div>
  <Button on:click={clickSearch} img="img/search.svg" text="Search" />
 </div>
 <table class="list-table">
  <thead>
   <tr>
    <ColumnHeader column="id" name="ID" align="center" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="name" name="Name" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="users_count" align="center" name="Number of users" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="created" align="center" name="Created" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader align="center" name="Action" />
   </tr>
  </thead>
  <tbody>
   {#each items as d (d.id)}
    <tr>
     <Cell align="center">{d.id}</Cell>
     <Cell>{d.name}</Cell>
     <Cell align="center">{d.users_count}</Cell>
     <Cell align="center">{new Date(d.created.replace(' ', 'T') + 'Z').toLocaleString()}</Cell>
     <Cell align="center">
      <div class="row">
       <div class="icon" role="button" tabindex="0" on:click={() => clickAddEdit(d.id)} on:keydown={() => keyAddEdit(d.id)}><img src="img/edit.svg" alt="Edit" /></div>
       <div class="icon" role="button" tabindex="0" on:click={() => clickDel(d.id, d.name)} on:keydown={() => keyDel(d.id)}><img src="img/del.svg" alt="Delete" /></div>
      </div>
     </Cell>
    </tr>
   {/each}
  </tbody>
 </table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
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
