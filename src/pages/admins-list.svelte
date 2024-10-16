<script>
 import { adminsList } from '../core.js';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Button from '../components/button.svelte';
 import Modal from '../components/modal.svelte';
 import ModalAdminsAdd from '../modals/modal-admins-add-edit.svelte';
 import ModalAdminsDel from '../modals/modal-admins-del.svelte';
 import Cell from '../components/table-cell.svelte';
 export let contentElement;
 let items = [];
 let isModalAddEditOpen = false;
 let isModalDelOpen = false;
 let adminID = null;
 let adminUsername = null;
 let filterUsername = null;
 let filterOffset = 0;
 let lazyLoader;
 let sortBy = 'id';
 let sortDir = 'ASC';

 function reloadItems() {
  lazyLoader.reload({ name: filterUsername }, filterOffset);
 }

 async function loadItems(show_items_callback, count, offset, filters) {
  console.log('loadItems count:', count, 'offset:', offset, 'sortBy:', sortBy, 'sortDir:', sortDir, 'filters', filters);
  adminsList(res => show_items_callback({ error: res.error, items: res.data.admins }), count, offset, filters?.name, sortBy, sortDir);
 }

 function clickAddEdit(id = null) {
  adminID = id;
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
  filterUsername = null;
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
  adminID = id;
  adminUsername = name;
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
  <Button on:click={() => clickAddEdit()} img="img/add.svg" text="Add a new admin" />
  <Button on:click={() => clickReload()} img="img/reload.svg" text="Reload" />
 </div>
 <div class="buttons">
  <div class="search">
   <div>Admin username:</div>
   <input type="text" placeholder="Username" bind:value={filterUsername} on:keydown={keySearchForm} />
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
    <ColumnHeader column="username" name="Username" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="created" align="center" name="Created" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader align="center" name="Action" />
   </tr>
  </thead>
  <tbody>
   {#each items as a (a.id)}
    <tr>
     <Cell align="center">{a.id}</Cell>
     <Cell>{a.username}</Cell>
     <Cell align="center">{new Date(a.created).toLocaleString()}</Cell>
     <Cell align="center">
      <div class="row">
       <div class="icon" role="button" tabindex="0" on:click={() => clickAddEdit(a.id)} on:keydown={() => keyAddEdit(a.id)}><img src="img/edit.svg" alt="Edit" /></div>
       <div class="icon" role="button" tabindex="0" on:click={() => clickDel(a.id, a.username)} on:keydown={() => keyDel(a.id, a.username)}><img src="img/del.svg" alt="Delete" /></div>
      </div>
     </Cell>
    </tr>
   {/each}
  </tbody>
 </table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
</div>
{#if isModalAddEditOpen}
 <Modal title={adminID ? 'Edit the admin' : 'Add a new admin'} onClose={onModalAddEditClose}>
  <ModalAdminsAdd id={adminID} onClose={onModalAddEditClose} />
 </Modal>
{/if}
{#if isModalDelOpen}
 <Modal title="Delete the admin" onClose={onModalDelClose}>
  <ModalAdminsDel id={adminID} name={adminUsername} onClose={onModalDelClose} />
 </Modal>
{/if}
