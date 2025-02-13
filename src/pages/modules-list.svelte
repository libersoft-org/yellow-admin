<script>
 import { modulesList, modulesDel } from '../core.js';
 import Page from '../components/page.svelte';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Buttons from '../components/buttons.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Modal from '../components/modal.svelte';
 import ModalModulesAdd from '../modals/modal-modules-add-edit.svelte';
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
 let moduleID = null;
 let moduleName = null;
 let filterName = null;
 let filterOffset = 0;
 let lazyLoader;
 let sortBy = 'id';
 let sortDir = 'ASC';

 function reloadItems() {
  lazyLoader.reload({ name: filterName }, filterOffset);
 }

 async function loadItems(show_items_callback, count, offset, filters) {
  //console.log('loadItems count:', count, 'offset:', offset, 'sortBy:', sortBy, 'sortDir:', sortDir, 'filter', filters);
  modulesList(res => show_items_callback({ error: res.error, items: res.data.modules }), count, offset, filters?.name, sortBy, sortDir);
 }

 function clickAddEdit(id = null) {
  moduleID = id;
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
  moduleID = id;
  moduleName = name;
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
  <Button img="img/add.svg" text="Add a new module" onClick={() => clickAddEdit()} />
  <Button img="img/reload.svg" text="Reload" onClick={() => clickReload()} />
 </Buttons>
 <Buttons>
  <div class="search">
   <div>Module name:</div>
   <Input placeholder="tld.domain.product" bind:value={filterName} onKeydown={keySearchForm} />
  </div>
  <div class="search">
   <div>Offset:</div>
   <Input type="number" min="0" placeholder="0" bind:value={filterOffset} onKeydown={keySearchForm} />
  </div>
  <Button img="img/search.svg" text="Search" onClick={clickSearch} />
 </Buttons>
 <Table>
  <Thead>
   <TheadTr>
    <ColumnHeader column="id" name="ID" align="center" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="name" name="Name" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="connection-string" name="Connection string" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="created" align="center" name="Created" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader align="center" name="Action" />
   </TheadTr>
  </Thead>
  <Tbody>
   {#each items as m (m.id)}
    <TbodyTr>
     <Td align="center">{m.id}</Td>
     <Td>{m.name}</Td>
     <Td align="center">{m.connection_string}</Td>
     <Td align="center">{new Date(m.created).toLocaleString()}</Td>
     <Td align="center">
      <Icons>
       <Icon img="img/edit.svg" onClick={() => clickAddEdit(m.id)} />
       <Icon img="img/del.svg" onClick={() => clickDel(m.id, m.name)} />
      </Icons>
     </Td>
    </TbodyTr>
   {/each}
  </Tbody>
 </Table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
</Page>

<Modal title={moduleID ? 'Edit the module (ID: ' + moduleID + ')' : 'Add a new module'} body={ModalModulesAdd} params={{ onSubmit: reloadItems, id: moduleID }} bind:show={isModalAddEditOpen} />
<Modal title="Delete the module" body={ModalItemDel} params={{ onSubmit: reloadItems, fn: modulesDel, id: moduleID, name: moduleName }} bind:show={isModalDelOpen} />
