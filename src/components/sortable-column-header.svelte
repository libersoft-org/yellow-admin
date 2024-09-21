<script>
 export let name;
 export let column;
 export let sortBy;
 export let sortDir;
 export let sortingChanged;

 function clickSortBy(columnName) {
  if (sortBy === columnName) {
   sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  } else {
   sortBy = columnName;
   sortDir = 'asc';
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

<th class="center">
 <div class="row column" role="button" tabindex="0" on:click={() => clickSortBy(column)} on:keydown={() => keySortBy(column)}>
  <div>{name}</div>
  {#if sortBy === column}
   {#if sortDir === 'desc'}
    <div class="icon"><img src="img/down.svg" alt="▼" /></div>
   {:else}
    <div class="icon"><img src="img/up.svg" alt="▲" /></div>
   {/if}
  {/if}
 </div>
</th>
