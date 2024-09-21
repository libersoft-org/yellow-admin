<script>
 export let align = 'left';
 export let name;
 export let column;
 export let sortBy;
 export let sortDir;
 export let sortingChanged;

 function clickSortBy(columnName) {
  if (sortBy === columnName) sortDir = sortDir === 'ASC' ? 'DESC' : 'ASC';
  else {
   sortBy = columnName;
   sortDir = 'ASC';
  }
  sortingChanged({sortBy, sortDir});
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
  justify-content: center;
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

 th .column {
  cursor: pointer;
 }
</style>

<th>
 <div class="row column" style="text-align: {align}" role="button" tabindex="0" on:click={() => clickSortBy(column)} on:keydown={() => keySortBy(column)}>
  <div>{name}</div>
  {#if sortBy === column}
   {#if sortDir === 'DESC'}
    <div class="icon"><img src="img/down.svg" alt="▼" /></div>
   {:else}
    <div class="icon"><img src="img/up.svg" alt="▲" /></div>
   {/if}
  {/if}
 </div>
</th>
