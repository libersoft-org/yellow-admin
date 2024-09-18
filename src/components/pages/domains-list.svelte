<script>
 import { onMount, onDestroy } from 'svelte';
 import { hideSidebarMobile, domainsList } from '../../core.js';
 import Modal from '../modal.svelte';
 import ModalDomainsAdd from '../modal-domains-add-edit.svelte';
 import ModalDomainsDel from '../modal-domains-del.svelte';

 export let contentHeight;

 let domainsArray = [];
 let isModalAddEditOpen = false;
 let isModalDelOpen = false;
 let domainID = null;
 let domainName = null;

 let loading = false;
 let count = 1;
 let offset = 0;
 let hasMore = true;
 let observer;
 let loaderElement;

 onMount(() => {
  observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
 });
 onDestroy(() => {
  if (observer) observer.disconnect();
 });

 $: if (observer && loaderElement) {
  observer.observe(loaderElement);
  //if (isLoaderVisible()) console.log('initial handleIntersect');
  handleIntersect([{ isIntersecting: true }]);
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

 function showTable() {
  if (loading || !hasMore) return;
  loading = true;
  domainsList(
   res => {
    if (res.error === 0) {
     domainsArray = [...domainsArray, ...res.data.domains];
     console.log('domainsArray.length:' + domainsArray.length);
     loading = false;
     offset += res.data.domains.length;
     if (res.data.domains.length < count) {
      hasMore = false;
      if (observer) observer.disconnect();
     } else {
      setTimeout(() => {
       if (isLoaderVisible()) showTable();
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

 function handleIntersect(entries) {
  //console.log('handleIntersect');
  if (entries[0].isIntersecting && !loading && hasMore) showTable();
 }

 function clickMenu() {
  hideSidebarMobile.set(false);
 }

 function keyMenu() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickMenu();
  }
 }

 function clickAddEdit(id = null) {
  domainID = id;
  isModalAddEditOpen = true;
 }

 function keyAddEdit(id = null) {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickAddEdit(id);
  }
 }

 function onModalAddEditClose(reload = false) {
  isModalAddEditOpen = false;
  if (reload) {
   resetTable();
   showTable();
  }
 }

 function clickReload() {
  resetTable();
  showTable();
 }

 function resetTable() {
  domainsArray = [];
  offset = 0;
  loading = false;
  hasMore = true;
 }

 function keyReload() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickReload();
  }
 }

 function onModalDelClose(reload = false) {
  isModalDelOpen = false;
  if (reload) {
   resetTable();
   showTable();
  }
 }

 function clickDel(id, name) {
  domainID = id;
  domainName = name;
  isModalDelOpen = true;
 }

 function keyDel(id) {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickDel(id);
  }
 }
</script>

<style>
</style>

<div class="page">
 <div class="buttons">
  <div class="menu-button" role="button" tabindex="0" on:click={clickMenu} on:keydown={keyMenu}>
   <img src="img/menu.svg" alt="☰" />
  </div>
  <div class="button" role="button" tabindex="0" on:click={() => clickAddEdit()} on:keydown={() => keyAddEdit()}>
   <img src="img/add.svg" alt="Add a new domain" />
   <div>Add a new domain</div>
  </div>
  <div class="button" role="button" tabindex="0" on:click={clickReload} on:keydown={keyReload}>
   <img src="img/reload.svg" alt="Reload" />
   <div>Reload</div>
  </div>
 </div>
 <table class="list-table">
  <thead>
   <tr>
    <th class="center">ID</th>
    <th>Name</th>
    <th class="center">Number of users</th>
    <th class="center">Created</th>
    <th class="center">Action</th>
   </tr>
  </thead>
  <tbody>
   {#each domainsArray as d}
    <tr>
     <td class="center">{d.id}</td>
     <td>{d.name}</td>
     <td class="center">{d.users_count}</td>
     <td class="center">{new Date(d.created.replace(' ', 'T') + 'Z').toLocaleString()}</td>
     <td class="center">
      <div class="icons">
       <div class="icon" role="button" tabindex="0" on:click={() => clickAddEdit(d.id)} on:keydown={() => keyAddEdit(d.id)}><img src="img/edit.svg" alt="Edit" /></div>
       <div class="icon" role="button" tabindex="0" on:click={() => clickDel(d.id, d.name)} on:keydown={() => keyDel(d.id)}><img src="img/del.svg" alt="Delete" /></div>
      </div>
     </td>
    </tr>
   {/each}
  </tbody>
 </table>
 {#if hasMore}
  <div class="loader" bind:this={loaderElement}></div>
 {/if}
</div>
{#if isModalAddEditOpen}
 <Modal title={domainID ? 'Edit the domain' : 'Add a new domain'} onClose={onModalAddEditClose}>
  <ModalDomainsAdd id={domainID} onClose={onModalAddEditClose} />
 </Modal>
{/if}
{#if isModalDelOpen}
 <Modal title="Delete the domain" onClose={onModalDelClose}>
  <ModalDomainsDel id={domainID} name={domainName} onClose={onModalDelClose} />
 </Modal>
{/if}
