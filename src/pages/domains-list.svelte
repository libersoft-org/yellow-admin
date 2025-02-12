<script>
 import { domainsList, domainsDel } from '../core.js';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Modal from '../components/modal.svelte';
 import ModalDomainsAdd from '../modals/modal-domains-add-edit.svelte';
 import ModalItemDel from '../modals/modal-item-del.svelte';
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
  lazyLoader.reload({ name: filterName }, filterOffset);
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

 function clickDel(id, name) {
  domainID = id;
  domainName = name;
  isModalDelOpen = true;
 }

 function keyDel(id, name) {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickDel(id, name);
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
   <Input placeholder="domain.tld" bind:value={filterName} onKeydown={keySearchForm} />
  </div>
  <div class="search">
   <div>Offset:</div>
   <Input type="number" min="0" placeholder="0" bind:value={filterOffset} onKeydown={keySearchForm} />
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
     <Cell align="center">{new Date(d.created).toLocaleString()}</Cell>
     <Cell align="center">
      <div class="row">
       <div class="icon" role="button" tabindex="0" on:click={() => clickAddEdit(d.id)} on:keydown={() => keyAddEdit(d.id)}><img src="img/edit.svg" alt="Edit" /></div>
       <div class="icon" role="button" tabindex="0" on:click={() => clickDel(d.id, d.name)} on:keydown={() => keyDel(d.id, d.name)}><img src="img/del.svg" alt="Delete" /></div>
      </div>
     </Cell>
    </tr>
   {/each}
  </tbody>
 </table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
</div>

<Modal title={domainID ? 'Edit the domain' : 'Add a new domain'} body={ModalDomainsAdd} params={{ onSubmit: reloadItems, id: domainID }} bind:show={isModalAddEditOpen} />
<Modal title="Delete the domain" body={ModalItemDel} params={{ onSubmit: reloadItems, fn: domainsDel, id: domainID, name: domainName }} bind:show={isModalDelOpen} />
