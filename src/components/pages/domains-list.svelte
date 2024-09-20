<script>
 import { hideSidebarMobile, domainsList } from '../../core.js';
 import Modal from '../modal.svelte';
 import ModalDomainsAdd from '../modal-domains-add-edit.svelte';
 import ModalDomainsDel from '../modal-domains-del.svelte';
 import LazyLoader from '../lazy-loader.svelte';
 export let contentElement;
 let items = [];
 let isModalAddEditOpen = false;
 let isModalDelOpen = false;
 let domainID = null;
 let domainName = null;
 let filterName = null;
 let filterIDFrom = null;
 let lazyLoader;

 async function loadItems(cb, count, lastID, filterName = null) {
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
  <div class="menu-button" role="button" tabindex="0" on:click={clickMenu} on:keydown={keyMenu}>
   <img src="img/menu.svg" alt="☰" />
  </div>
  <div class="button" role="button" tabindex="0" on:click={() => clickAddEdit()} on:keydown={() => keyAddEdit()}>
   <img src="img/add.svg" alt="Add a new domain" />
   <div>Add a new domain</div>
  </div>
  <div class="button" role="button" tabindex="0" on:click={() => lazyLoader.reload()} on:keydown={keyReload}>
   <img src="img/reload.svg" alt="Reload" />
   <div>Reload</div>
  </div>
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
  <div class="button" role="button" tabindex="0" on:click={clickSearch} on:keydown={keySearch}>
   <img src="img/search.svg" alt="Search" />
   <div>Search</div>
  </div>
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
