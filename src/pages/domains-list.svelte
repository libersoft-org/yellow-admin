<script>
 import { hideSidebarMobile, domainsList } from '../core.js';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Button from '../components/button.svelte';
 import Modal from '../components/modal.svelte';
 import ModalDomainsAdd from '../modals/modal-domains-add-edit.svelte';
 import ModalDomainsDel from '../modals/modal-domains-del.svelte';
 export let contentElement;
 let items = [];
 let isModalAddEditOpen = false;
 let isModalDelOpen = false;
 let domainID = null;
 let domainName = null;
 let filterName = null;
 let filterIDFrom = null;
 let lazyLoader;
 let sortBy = 'id';
 let sortDir = 'asc';


 async function loadItems(cb, count, lastID, filterName = null) {
  console.log('loadItems');
  domainsList(res => cb({error: res.error, items: res.data.domains}), count, lastID, filterName);
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


 function onModalAddEditClose(reload = false) {
  isModalAddEditOpen = false;
  if (reload) {
   resetTable();
   showTable();
  }
 }

 function keyReload() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   lazyLoader.reload();
  }
 }

 function clickSearch() {
  console.log('search');
  console.log(filterName, filterIDFrom);
  lazyLoader.reload(filterName, filterIDFrom - 1);
 }

 function keySearch() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickSearch();
  }
 }

 function keySearchForm() {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickSearch();
  }
 }

 function clickSortBy(columnName) {
  console.log(columnName);
 }

 function keySortBy(columnName) {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickSortBy(columnName);
  }
 }

 function onModalDelClose(reload = false) {
  isModalDelOpen = false;
  if (reload) lazyLoader.reset();
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
 .search {
  display: flex;
  align-items: center;
  gap: 10px;
 }
</style>

<div class="page">
 <div class="buttons">

  <div class="menu-button" role="button" tabindex="0" on:click={clickMenu} on:keydown={keyMenu} >
   <img src="img/menu.svg" alt="☰" />
  </div>

  <Button on:click={() => clickAddEdit()} img="img/add.svg" text="Add a new domain" />
  <Button on:click={() => lazyLoader.reload()} img="img/reload.svg" text="Reload" />

 </div>
 <div class="buttons">
  <div class="search">
   <div>Domain name:</div>
   <input type="text" placeholder="domain.tld" bind:value={filterName} on:keydown={keySearchForm}>
  </div>
  <div class="search">
   <div>Record ID from:</div>
   <input type="text" placeholder="0" bind:value={filterIDFrom} on:keydown={keySearchForm}>
  </div>
  <Button on:click={clickSearch} img="img/search.svg" text="Search" />
 </div>
 <table class="list-table">
  <thead>
   <tr>
    <th class="center">
     <div class="row column" role="button" tabindex="0" on:click={() => clickSortBy('id')} on:keydown={() => keySortBy('id')}>
      <div>ID</div>
      <div class="icon"><img src="img/down.svg" alt="▼" /><!-- ▲ --></div>
     </div>
    </th>
    <th>
     <div class="row column" role="button" tabindex="0" on:click={() => clickSortBy('name')} on:keydown={() => keySortBy('name')}>
      <div>Name</div>
      <div class="icon"><img src="img/down.svg" alt="▼" /></div>
     </div>
    </th>
    <th class="center">Number of users</th>
    <th class="center">
     <div class="row column" role="button" tabindex="0" on:click={() => clickSortBy('created')} on:keydown={() => keySortBy('created')}>
      <div>Created</div>
      <div class="icon"><img src="img/down.svg" alt="▼" /></div>
     </div>
    </th>
    <th class="center">Action</th>
   </tr>
  </thead>
  <tbody>
   {#each items as d}
    <tr>
     <td class="center">{d.id}</td>
     <td>{d.name}</td>
     <td class="center">{d.users_count}</td>
     <td class="center">{new Date(d.created.replace(' ', 'T') + 'Z').toLocaleString()}</td>
     <td class="center">
      <div class="row">
       <div class="icon" role="button" tabindex="0" on:click={() => clickAddEdit(d.id)} on:keydown={() => keyAddEdit(d.id)}><img src="img/edit.svg" alt="Edit" /></div>
       <div class="icon" role="button" tabindex="0" on:click={() => clickDel(d.id, d.name)} on:keydown={() => keyDel(d.id)}><img src="img/del.svg" alt="Delete" /></div>
      </div>
     </td>
    </tr>
   {/each}
  </tbody>
 </table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items={items} />
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
