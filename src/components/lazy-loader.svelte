<script>
 import { tick, onMount, onDestroy } from 'svelte';
 import Spinner from './spinner.svelte';
 export let loadItems;
 export let items;
 export let contentElement;
 const threshold = 0.1;
 let hasMore = true;
 let loading = false;
 let count = 10;
 let offset = 0;
 let filters = {};
 let loaderElement;
 let _loaderIsVisible = true;
 let observer;
 let timer;
 let observing = false;

 onMount(() => {
  //console.log('contentElement is ' + contentElement);
  observer = new IntersectionObserver(handleIntersect, { threshold, root: contentElement });
  //console.log('loaderElement is ' + loaderElement);
  if (loaderElement) {
   observer.observe(loaderElement);
   observing = true;
  }
 });

 onDestroy(() => {
  if (observer) observer.disconnect();
  if (timer) clearTimeout(timer);
 });

 $: if (observer && loaderElement) {
  if (!observing) {
   observer.observe(loaderElement);
  }
  handleIntersect([{ isIntersecting: true }]);
 }

 export function reload(filters_, offset_) {
  filters = filters_;
  offset = offset_;
  items = [];
  loading = false;
  hasMore = true;
  loadMore();
 }

 function loadMore() {
  if (loading || !hasMore) return;
  loading = true;
  loadItems(
   res => {
    if (res.error === false) {
     items = [...items, ...res.items];
     loading = false;
     offset += res.items.length;
     if (res.items.length < count) {
      hasMore = false;
      if (observer) observer.disconnect();
     } else {
      tick().then(() => {
       if (isLoaderVisible()) loadMore();
      });
     }
    } else {
     console.error('Error: ' + res.message);
     loading = false;
    }
   },
   count,
   offset,
   filters
  );
 }

 function isLoaderVisible() {
  let result = false;
  /*
  if (loaderElement) {
   const rect = loaderElement.getBoundingClientRect();
   result = rect.top < contentHeight;
   //console.log('rect.top:' + rect.top + ', contentHeight:' + contentHeight);
  } else result = false;
  */
  result = _loaderIsVisible;
  //console.log('isLoaderVisible:' + result);
  return result;
 }

 function handleIntersect(entries) {
  //console.log('handleIntersect:')
  //console.log(entries);
  _loaderIsVisible = entries[entries.length - 1].isIntersecting;
  if (_loaderIsVisible && !loading && hasMore) loadMore();
 }
</script>

{#if hasMore}
 <Spinner bind:elSpinner={loaderElement} />
{/if}
