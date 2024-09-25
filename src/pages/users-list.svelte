<script>
 import { usersList, domainsList } from '../core.js';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Button from '../components/button.svelte';
 import Modal from '../components/modal.svelte';
 import ModalUsersAdd from '../modals/modal-users-add-edit.svelte';
 import ModalUsersDel from '../modals/modal-users-del.svelte';
 import Cell from '../components/table-cell.svelte';
 import { onMount } from 'svelte';
 export let contentElement;
 let domains = [];
 let items = [];
 let isModalAddEditOpen = false;
 let isModalDelOpen = false;
 let filterDomainID = null;
 let userID = null;
 let delAddress = null;
 let filterUsername = null;
 let filterOffset = 0;
 let lazyLoader;
 let sortBy = 'id';
 let sortDir = 'ASC';

 $: console.log('filterUsername:', filterUsername, 'filterDomainID:', filterDomainID, 'filterOffset:', filterOffset);

 onMount(() => {
  domainsList(
   res => {
    if (res.error === 0) domains = [{id: null, name:'ALL'}, ...res.data.domains];
   },
   5,
   0,
   null,
   'id',
   'ASC'
  );
 });

 function reloadItems() {
  lazyLoader.reload({ username: filterUsername, domainID: filterDomainID }, filterOffset);
 }

 async function loadItems(show_items_callback, count, offset, filters) {
  console.log('loadItems count:', count, 'offset:', offset, 'sortBy:', sortBy, 'sortDir:', sortDir, 'filters:', filters);
  usersList(res => show_items_callback({ error: res.error, items: res.data.users }), count, offset, filters, sortBy, sortDir);
 }

 function clickAddEdit(id = null) {
  userID = id;
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
  reloadItems();
 }

 function clickReload() {
  filterUsername = null;
  filterOffset = 0;
  reloadItems();
 }

 function keySearchForm() {
  console.log('keySearchForm');
  if (event.key === 'Enter') {
   event.preventDefault();
   clickSearch();
  }
 }

 function onModalDelClose(reload = false) {
  isModalDelOpen = false;
  reloadItems();
 }

 function clickDel(id, username) {
  userID = id;
  delAddress = username;
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
  <Button on:click={() => clickAddEdit()} img="img/add.svg" text="Add a new user" />
  <Button on:click={() => clickReload()} img="img/reload.svg" text="Reload" />
 </div>
 <div class="buttons">
  <div class="search">
   <div>Username:</div>
   <input type="text" placeholder="Username" bind:value={filterUsername} on:keydown={keySearchForm} />
  </div>
  <div class="search">
   <div>@</div>
   <select bind:value={filterDomainID}>
    {#each domains as d (d.id)}
     <option value={d.id}>{d.name}</option>
    {/each}
   </select>
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
    <ColumnHeader column="address" name="Address" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="visible_name" name="Visible name" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="created" align="center" name="Created" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader align="center" name="Action" />
   </tr>
  </thead>
  <tbody>

   {#each items as u (u.id)}
    <tr>
     <Cell align="center">{u.id}</Cell>
     <Cell>{u.address}</Cell>
     <Cell>{u.visible_name}</Cell>
     <Cell align="center">{new Date(u.created.replace(' ', 'T') + 'Z').toLocaleString()}</Cell>
     <Cell align="center">
      <div class="row">
       <div class="icon" role="button" tabindex="0" on:click={() => clickAddEdit(u.id)} on:keydown={() => keyAddEdit(u.id)}><img src="img/edit.svg" alt="Edit" /></div>
       <div class="icon" role="button" tabindex="0" on:click={() => clickDel(u.id, u.address)} on:keydown={() => keyDel(u.id, u.address)}><img src="img/del.svg" alt="Delete" /></div>
      </div>
     </Cell>
    </tr>
   {/each}
  </tbody>
 </table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
</div>
{#if isModalAddEditOpen}
 <Modal title={userID ? 'Edit the user' : 'Add a new user'} onClose={onModalAddEditClose}>
  <ModalUsersAdd id={userID} onClose={onModalAddEditClose} />
 </Modal>
{/if}
{#if isModalDelOpen}
 <Modal title="Delete the user" onClose={onModalDelClose}>
  <ModalUsersDel id={userID} address={delAddress} onClose={onModalDelClose} />
 </Modal>
{/if}
