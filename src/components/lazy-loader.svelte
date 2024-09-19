<script>
 import { onMount, onDestroy } from 'svelte';
 export let loadItems;
 export let items;
 export let contentElement;
 const threshold = 0.1;
 let hasMore = true;
 let loading = false;
 let count = 10;
 let offset = 0;
 let observer;
 let loaderElement;
 let timer;
 let _loaderIsVisible = true;

 /*
 let contentHeight;
 $: contentHeight = contentElement ? contentElement.clientHeight : null;
 */

 export function reload() {
  reset();
  loadMore();
 }

 export function reset() {
  items = [];
  offset = 0;
  loading = false;
  hasMore = true;
 }

 function loadMore() {
  if (loading || !hasMore) return;
  loading = true;
  loadItems(
   res => {
    if (res.error === 0) {
     items = [...items, ...res.items];
     //console.log('items.length:' + items.length);
     loading = false;
     offset += res.items.length;
     if (res.items.length < count) {
      hasMore = false;
      if (observer) observer.disconnect();
     } else {
      setTimeout(() => {
       if (isLoaderVisible()) loadMore();
      }, 500);
     }
    } else {
     console.error('Error: ' + res.message);
     loading = false;
    }
   },
   count,
   offset
  );
 }

 function isLoaderVisible() {
  let result = false;
  /*
  if (loaderElement) {
   const rect = loaderElement.getBoundingClientRect();
   result = rect.top < contentHeight;
   console.log('rect.top:' + rect.top + ', contentHeight:' + contentHeight);
  } else result = false;
  */
  result = _loaderIsVisible;
  //console.log('isLoaderVisible:' + result);
  return result;
 }

 function handleIntersect(entries) {
  //console.log('handleIntersect:')
  //console.log(entries);

  _loaderIsVisible = entries[0].isIntersecting;
  if (_loaderIsVisible && !loading && hasMore) {
   loadMore();
  }
 }

 onMount(() => {
  //console.log('contentElement is ' + contentElement);
  //console.log('loaderElement is ' + loaderElement);
  observer = new IntersectionObserver(handleIntersect, { threshold, root: contentElement });
  if (loaderElement) observer.observe(loaderElement);
 });

 onDestroy(() => {
  if (observer) observer.disconnect();
  if (timer) clearTimeout(timer);
 });

 $: if (observer && loaderElement) {
  observer.observe(loaderElement);
  handleIntersect([{ isIntersecting: true }]);
 }
</script>

<style>
</style>

{#if hasMore}
 <div class="loader" bind:this={loaderElement}></div>
{/if}
