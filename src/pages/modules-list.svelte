<script>
 import { modulesList } from '../core.js';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Button from '../components/button.svelte';
 import Modal from '../components/modal.svelte';
 import ModalModulesAdd from '../modals/modal-modules-add-edit.svelte';
 import ModalModulesDel from '../modals/modal-modules-del.svelte';
 import Cell from '../components/table-cell.svelte';
 import { getContext } from "svelte";


 let contentElement = getContext('contentElement');
 let items = [];
 let isModalAddEditOpen = false;
 let isModalDelOpen = false;
 let moduleID = null;
 let moduleName = null;
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
  modulesList(res => show_items_callback({ error: res.error, items: res.data.modules }), count, offset, filters?.name, sortBy, sortDir);
 }

 function clickAddEdit(id = null) {
  moduleID = id;
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

 function onModalDelClose(reload = false) {
  isModalDelOpen = false;
  reloadItems();
 }

 function clickDel(id, name) {
  moduleID = id;
  moduleName = name;
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
  <Button on:click={() => clickAddEdit()} img="img/add.svg" text="Add a new module" />
  <Button on:click={() => clickReload()} img="img/reload.svg" text="Reload" />
 </div>
 <div class="buttons">
  <div class="search">
   <div>Module name:</div>
   <input type="text" placeholder="tld.domain.product" bind:value={filterName} on:keydown={keySearchForm} />
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
    <ColumnHeader column="connection-string" name="Connection string" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="created" align="center" name="Created" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader align="center" name="Action" />
   </tr>
  </thead>
  <tbody>
   {#each items as m (m.id)}
    <tr>
     <Cell align="center">{m.id}</Cell>
     <Cell>{m.name}</Cell>
     <Cell align="center">{m.connection_string}</Cell>
     <Cell align="center">{new Date(m.created).toLocaleString()}</Cell>
     <Cell align="center">
      <div class="row">
       <div class="icon" role="button" tabindex="0" on:click={() => clickAddEdit(m.id)} on:keydown={() => keyAddEdit(m.id)}><img src="img/edit.svg" alt="Edit" /></div>
       <div class="icon" role="button" tabindex="0" on:click={() => clickDel(m.id, m.name)} on:keydown={() => keyDel(m.id, m.name)}><img src="img/del.svg" alt="Delete" /></div>
      </div>
     </Cell>
    </tr>
   {/each}
  </tbody>
 </table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
</div>

<Modal title={moduleID ? 'Edit the module' : 'Add a new module'} body={ModalModulesAdd} params={{ onSubmit: reloadItems, id: moduleID }}, bind:show={isModalAddEditOpen}/>
<Modal title="Delete the module" body={ModalModulesDel} params={{ onSubmit: reloadItems, id: moduleID, name: moduleName }}, bind:show={isModalDelOpen}/>
