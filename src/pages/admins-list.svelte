<script>
 import { adminsList } from '../core.js';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Buttons from '../components/buttons.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Modal from '../components/modal.svelte';
 import ModalAdminsAdd from '../modals/modal-admins-add-edit.svelte';
 import ModalAdminsDel from '../modals/modal-admins-del.svelte';
 import Cell from '../components/table-cell.svelte';
 import Icons from '../components/icons.svelte';
 import Icon from '../components/icons-icon.svelte';
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
  //console.log('loadItems count:', count, 'offset:', offset, 'sortBy:', sortBy, 'sortDir:', sortDir, 'filters', filters);
  adminsList(res => show_items_callback({ error: res.error, items: res.data.admins }), count, offset, filters?.name, sortBy, sortDir);
 }

 function clickAddEdit(id = null) {
  adminID = id;
  isModalAddEditOpen = true;
 }

 function clickSearch() {
  reloadItems();
 }

 function clickReload() {
  filterUsername = null;
  filterOffset = 0;
  reloadItems();
 }

 function keySearchForm(event) {
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
</script>

<style>
 .search {
  display: flex;
  align-items: center;
  gap: 10px;
 }
</style>

<div class="page">
 <Buttons>
  <MenuButton />
  <Button img="img/add.svg" text="Add a new admin" onClick={() => clickAddEdit()} />
  <Button img="img/reload.svg" text="Reload" onClick={clickReload} />
 </Buttons>
 <Buttons>
  <div class="search">
   <div>Admin username:</div>
   <Input placeholder="Username" bind:value={filterUsername} onKeydown={keySearchForm} />
  </div>
  <div class="search">
   <div>Offset:</div>
   <Input type="number" min="0" placeholder="0" bind:value={filterOffset} onKeydown={keySearchForm} />
  </div>
  <Button img="img/search.svg" text="Search" onClick={clickSearch} />
 </Buttons>
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
      <Icons>
       <Icon img="img/edit.svg" alt="Edit" onClick={() => clickAddEdit(a.id)} />
       <Icon img="img/del.svg" alt="Delete" onClick={() => clickDel(a.id, a.username)} />
      </Icons>
     </Cell>
    </tr>
   {/each}
  </tbody>
 </table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
</div>

<Modal title={adminID ? 'Edit the admin' : 'Add a new admin'} body={ModalAdminsAdd} params={{ onSubmit: reloadItems, id: adminID }} bind:show={isModalAddEditOpen} />
<Modal title="Delete the admin" body={ModalAdminsDel} params={{ onSubmit: reloadItems, id: adminID }} bind:show={isModalDelOpen} />
