<script>
 import { sessionsList, sessionsDel } from '../core.js';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Buttons from '../components/buttons.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Modal from '../components/modal.svelte';
 import ModalItemDel from '../modals/modal-item-del.svelte';
 import Cell from '../components/table-cell.svelte';
 import Icons from '../components/icons.svelte';
 import Icon from '../components/icons-icon.svelte';
 export let contentElement;
 let items = [];
 let isModalDelOpen = false;
 let sessionID = null;
 let sessionName = null;
 let filterName = null;
 let filterOffset = 0;
 let lazyLoader;
 let sortBy = 'id';
 let sortDir = 'ASC';

 function reloadItems() {
  lazyLoader.reload({ name: filterName }, filterOffset);
 }

 async function loadItems(show_items_callback, count, offset, filters) {
  //console.log('loadItems count:', count, 'offset:', offset, 'sortBy:', sortBy, 'sortDir:', sortDir, 'filter', filters);
  sessionsList(res => show_items_callback({ error: res.error, items: res.data.sessions }), count, offset, filters?.name, sortBy, sortDir);
 }

 function clickSearch() {
  reloadItems();
 }

 function clickReload() {
  filterName = null;
  filterOffset = 0;
  reloadItems();
 }

 function keySearchForm(event) {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickSearch();
  }
 }

 function clickDel(id, session) {
  sessionID = id;
  sessionName = session;
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
  <Button img="img/reload.svg" text="Reload" onClick={() => clickReload()} />
 </Buttons>
 <Buttons>
  <div class="search">
   <div>Session name:</div>
   <Input placeholder="Session" bind:value={filterName} onKeydown={keySearchForm} />
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
    <ColumnHeader column="session" name="Session" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="last" align="center" name="Last used" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="created" align="center" name="Created" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader align="center" name="Action" />
   </tr>
  </thead>
  <tbody>
   {#each items as s (s.id)}
    <tr>
     <Cell align="center">{s.id}</Cell>
     <Cell>{s.session}</Cell>
     <Cell align="center">{new Date(s.last).toLocaleString()}</Cell>
     <Cell align="center">{new Date(s.created).toLocaleString()}</Cell>
     <Cell align="center">
      <Icons>
       <Icon img="img/del.svg" alt="Delete" onClick={() => clickDel(s.id, s.session)} />
      </Icons>
     </Cell>
    </tr>
   {/each}
  </tbody>
 </table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
</div>

<Modal title="Delete the session" body={ModalItemDel} params={{ onSubmit: reloadItems, fn: _id => sessionsDel(sessionName), id: sessionID, name: sessionName }} bind:show={isModalDelOpen} />
