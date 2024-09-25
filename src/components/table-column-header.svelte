<script>
 export let align = 'left';
 export let name;
 export let column = undefined;
 export let sortBy = undefined;
 export let sortDir = undefined;
 export let sortingChanged = () => {};

 let sortable = column !== undefined;
 let role = sortable ? 'button' : undefined;
 let tabindex = sortable ? 0 : undefined;

 function clickSortBy(columnName) {
  console.log('clickSortBy', columnName, "sortBy", sortBy, "sortDir", sortDir);
  if (sortBy === columnName) sortDir = sortDir === 'ASC' ? 'DESC' : 'ASC';
  else {
   sortBy = columnName;
   sortDir = 'ASC';
  }
  sortingChanged({ sortBy, sortDir });
 }

 function keySortBy(columnName) {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickSortBy(columnName);
  }
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

 th .row .icon {
  display: flex;
  padding: 5px;
  cursor: pointer;
 }

 th .row .icon img {
  width: 20px;
  height: 20px;
 }

 .sortable {
  cursor: pointer;
 }
</style>

<th>
 <div class="row {sortable ? 'sortable' : ''}" style="justify-content: {align}" {role} {tabindex} on:click={() => clickSortBy(column)} on:keydown={() => keySortBy(column)}>
  <div>{name}</div>
  {#if sortable && sortBy === column}
   {#if sortDir === 'DESC'}
    <div class="icon"><img src="img/down.svg" alt="▼" /></div>
   {:else}
    <div class="icon"><img src="img/up.svg" alt="▲" /></div>
   {/if}
  {/if}
 </div>
</th>
