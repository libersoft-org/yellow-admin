<script>
 import { domainsList, domainsDel } from '../core.js';
 import Page from '../components/page.svelte';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Buttons from '../components/buttons.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Modal from '../components/modal.svelte';
 import ModalDomainsAdd from '../modals/modal-domains-add-edit.svelte';
 import ModalItemDel from '../modals/modal-item-del.svelte';
 import Table from '../components/table.svelte';
 import Thead from '../components/table-thead.svelte';
 import TheadTr from '../components/table-thead-tr.svelte';
 import Tbody from '../components/table-tbody.svelte';
 import TbodyTr from '../components/table-tbody-tr.svelte';
 import Td from '../components/table-td.svelte';
 import Icons from '../components/icons.svelte';
 import Icon from '../components/icons-icon.svelte';
 export let contentElement;
 let items = [];
 let isModalAddEditOpen = false;
 let isModalDelOpen = false;
 let domainID = null;
 let domainName = null;
 let filterName = null;
 let filterOffset = 0;
 let lazyLoader;
 let sortBy = 'id';
 let sortDir = 'ASC';

 function reloadItems() {
  lazyLoader.reload({ name: filterName }, filterOffset);
 }

 async function loadItems(show_items_callback, count, offset, filters) {
  domainsList(res => show_items_callback({ error: res.error, items: res.data.domains }), count, offset, filters?.name, sortBy, sortDir);
 }

 function clickAddEdit(id = null) {
  domainID = id;
  isModalAddEditOpen = true;
 }

 function clickSearch() {
  reloadItems();
 }

 function clickReload() {
  filterName = null;
  filterOffset = 0;
  reloadItems();
 }

 function keySearchForm(event) {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickSearch();
  }
 }

 function clickDel(id, name) {
  domainID = id;
  domainName = name;
  isModalDelOpen = true;
 }
</script>

<style>
 .search {
  display: flex;
  align-items: center;
  gap: 10px;
 }
</style>

<Page>
 <Buttons>
  <MenuButton />
  <Button data-testid="domains-add-button" img="img/add.svg" text="Add a new domain" onClick={() => clickAddEdit()} />
  <Button data-testid="domains-reload-button" img="img/reload.svg" text="Reload" onClick={() => clickReload()} />
 </Buttons>
 <Buttons>
  <div class="search">
   <div>Domain name:</div>
   <Input data-testid="domains-filter-name" placeholder="domain.tld" bind:value={filterName} onKeydown={keySearchForm} />
  </div>
  <div class="search">
   <div>Offset:</div>
   <Input data-testid="domains-filter-offset" type="number" min="0" placeholder="0" bind:value={filterOffset} onKeydown={keySearchForm} />
  </div>
  <Button data-testid="domains-search-button" img="img/search.svg" text="Search" onClick={clickSearch} />
 </Buttons>
 <Table data-testid="domains-table">
  <Thead>
   <TheadTr>
    <ColumnHeader column="id" name="ID" align="center" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="name" name="Name" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="users_count" align="center" name="Number of users" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="created" align="center" name="Created" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader align="center" name="Action" />
   </TheadTr>
  </Thead>
  <Tbody>
   {#each items as d (d.id)}
    <TbodyTr>
     <Td align="center">{d.id}</Td>
     <Td>{d.name}</Td>
     <Td align="center">{d.users_count}</Td>
     <Td align="center">{new Date(d.created).toLocaleString()}</Td>
     <Td align="center">
      <Icons>
       <Icon data-testid="domains-edit-{d.id}" img="img/edit.svg" alt="Edit" onClick={() => clickAddEdit(d.id)} />
       <Icon data-testid="domains-delete-{d.id}" img="img/del.svg" alt="Delete" onClick={() => clickDel(d.id, d.name)} />
      </Icons>
     </Td>
    </TbodyTr>
   {/each}
  </Tbody>
 </Table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
</Page>

<Modal title={domainID ? 'Edit the domain (ID: ' + domainID + ')' : 'Add a new domain'} body={ModalDomainsAdd} params={{ onSubmit: reloadItems, id: domainID }} bind:show={isModalAddEditOpen} />
<Modal title="Delete the domain" body={ModalItemDel} params={{ onSubmit: reloadItems, fn: domainsDel, id: domainID, name: domainName }} bind:show={isModalDelOpen} />
