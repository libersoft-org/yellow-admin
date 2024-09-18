<script>
 import { onMount, onDestroy } from 'svelte';
 import {domainsList} from "../core.js";

 export let loadItems; // Funkce pro načtení více dat
 export let items;
 export let contentHeight;

 const threshold = 0.1; // Prahová hodnota pro IntersectionObserver

 let hasMore = true; // Indikátor, zda je více dat k načtení
 let loading = false;
 let count = 1;
 let offset = 0;
 let observer;
 let loaderElement;
 let timer;


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
     items = [...items, ...res.data.domains];
     console.log('items.length:' + items.length);
     loading = false;
     offset += res.data.domains.length;
     if (res.data.domains.length < count) {
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
  if (loaderElement) {
   const rect = loaderElement.getBoundingClientRect();
   result = rect.top < contentHeight;
   //console.log('rect.top:' + rect.top + ', contentHeight:' + contentHeight);
  } else result = false;
  //console.log('isLoaderVisible:' + result);
  return result;
 }

 function handleIntersect(entries) {
  if (entries[0].isIntersecting && !loading && hasMore) {
   loadMore();
  }
 }

 onMount(() => {
  observer = new IntersectionObserver(handleIntersect, { threshold });
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

{#if hasMore}
 <div class="loader" bind:this={loaderElement}></div>
{/if}

<style>
 .loader {
  /* Stylování loaderu podle potřeby */
 }
</style>
