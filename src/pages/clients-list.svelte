<script>
 import { clientsList, clientsKick } from '../core.js';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Button from '../components/button.svelte';
 import Cell from '../components/table-cell.svelte';
 export let contentElement;
 let items = [];
 let filterIp = null;
 let filterGuid = null;
 let filterOffset = 0;
 let lazyLoader;
 let sortBy = 'guid';
 let sortDir = 'ASC';

 function reloadItems() {
  lazyLoader.reload({ filterIp, filterGuid }, filterOffset);
 }

 async function loadItems(show_items_callback, count, offset, filters) {
  console.log('loadItems count:', count, 'offset:', offset, 'sortBy:', sortBy, 'sortDir:', sortDir, 'filters', filters);
  clientsList(
   res => {
    console.log(res);
    show_items_callback({ error: res.error, items: res.data.items });
   },
   count,
   offset,
   filters?.filterIp,
   filters?.filterGuid,
   sortBy,
   sortDir
  );
 }

 function clickSearch() {
  console.log('search');
  reloadItems();
 }

 function clickReload() {
  filterIp = null;
  filterGuid = null;
  filterOffset = 0;
  reloadItems();
 }

 function keySearchForm() {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickSearch();
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
  <MenuButton />
  <Button on:click={() => clickReload()} img="img/reload.svg" text="Reload" />
 </div>
 <div class="buttons">
  <div class="search">
   <div>Client's GUID:</div>
   <input type="text" placeholder="GUID" bind:value={filterGuid} on:keydown={keySearchForm} />
  </div>
  <div class="search">
   <div>Client's IP address:</div>
   <input type="text" placeholder="IP address" bind:value={filterIp} on:keydown={keySearchForm} />
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
    <ColumnHeader column="guid" name="ID" align="center" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="ip" name="IP address" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <td>Action</td>
   </tr>
  </thead>
  <tbody>
   {#each items as c (c.guid)}
    <tr>
     <Cell align="center">{c.guid}</Cell>
     <Cell>{c.ip}</Cell>
     <td><Button text="Kick" on:click={() => clientsKick(c.guid)} /></td>
    </tr>
   {/each}
  </tbody>
 </table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
</div>
