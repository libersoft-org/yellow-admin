<script>
 import { clientsList, clientsKick } from '../core.js';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Buttons from '../components/buttons.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Cell from '../components/table-cell.svelte';
 import Icons from '../components/icons.svelte';
 import Icon from '../components/icons-icon.svelte';
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
  //console.log('loadItems count:', count, 'offset:', offset, 'sortBy:', sortBy, 'sortDir:', sortDir, 'filters', filters);
  clientsList(
   res => {
    //console.log(res);
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
 <Buttons>
  <MenuButton />
  <Button img="img/reload.svg" text="Reload" onClick={() => clickReload()} />
 </Buttons>
 <Buttons>
  <div class="search">
   <div>Client's GUID:</div>
   <Input placeholder="GUID" bind:value={filterGuid} onKeydown={keySearchForm} />
  </div>
  <div class="search">
   <div>Client's IP address:</div>
   <Input placeholder="IP address" bind:value={filterIp} onKeydown={keySearchForm} />
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
     <Cell>
      <Icons>
       <Icon img="img/kick.svg" onClick={() => clientsKick(c.guid)} />
      </Icons>
     </Cell>
    </tr>
   {/each}
  </tbody>
 </table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
</div>
