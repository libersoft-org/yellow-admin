<script>
 import Icon from './icons-icon.svelte';
 export let align = 'left';
 export let name;
 export let column = undefined;
 export let sortBy = undefined;
 export let sortDir = undefined;
 export let sortingChanged = () => {};
 let sortable = column !== undefined;

 function clickSortBy(columnName) {
  //console.log('clickSortBy', columnName, 'sortBy', sortBy, 'sortDir', sortDir);
  if (sortBy === columnName) sortDir = sortDir === 'ASC' ? 'DESC' : 'ASC';
  else {
   sortBy = columnName;
   sortDir = 'ASC';
  }
  sortingChanged({ sortBy, sortDir });
 }
</script>

<style>
 th {
  padding: 10px;
 }

 th .row {
  display: flex;
  flex-direction: row;
  align-items: center;
 }

 .sortable {
  cursor: pointer;
 }
</style>

<th>
 {#if sortable}
  <div class="row sortable" style="justify-content: {align}">
   <div>{name}</div>
   {#if sortable && sortBy === column}
    {#if sortDir === 'DESC'}
     <Icon img="img/down.svg" alt="▼" onClick={() => clickSortBy(column)} />
    {:else}
     <Icon img="img/up.svg" alt="▲" onClick={() => clickSortBy(column)} />
    {/if}
   {/if}
  </div>
 {:else}
  <div class="row" style="justify-content: {align}">
   <div>{name}</div>
  </div>
 {/if}
</th>
