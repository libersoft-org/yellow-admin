<script>
 import { adminsList } from '../core.js';
 import Page from '../components/page.svelte';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Buttons from '../components/buttons.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Modal from '../components/modal.svelte';
 import ModalAdminsAdd from '../modals/modal-admins-add-edit.svelte';
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
 let adminID = null;
 let adminUsername = null;
 let filterUsername = null;
 let filterOffset = 0;
 let lazyLoader;
 let sortBy = 'id';
 let sortDir = 'ASC';

 function reloadItems() {
  lazyLoader.reload({ name: filterUsername }, filterOffset);
 }

 async function loadItems(show_items_callback, count, offset, filters) {
  //console.log('loadItems count:', count, 'offset:', offset, 'sortBy:', sortBy, 'sortDir:', sortDir, 'filters', filters);
  adminsList(res => show_items_callback({ error: res.error, items: res.data.admins }), count, offset, filters?.name, sortBy, sortDir);
 }

 function clickAddEdit(id = null) {
  adminID = id;
  isModalAddEditOpen = true;
 }

 function clickSearch() {
  reloadItems();
 }

 function clickReload() {
  filterUsername = null;
  filterOffset = 0;
  reloadItems();
 }

 function keySearchForm(event) {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickSearch();
  }
 }

 function onModalDelClose(reload = false) {
  isModalDelOpen = false;
  reloadItems();
 }

 function clickDel(id, name) {
  adminID = id;
  adminUsername = name;
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
  <Button img="img/add.svg" text="Add a new admin" onClick={() => clickAddEdit()} />
  <Button img="img/reload.svg" text="Reload" onClick={clickReload} />
 </Buttons>
 <Buttons>
  <div class="search">
   <div>Admin username:</div>
   <Input placeholder="Username" bind:value={filterUsername} onKeydown={keySearchForm} />
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
    <ColumnHeader column="username" name="Username" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="created" align="center" name="Created" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader align="center" name="Action" />
   </TheadTr>
  </Thead>
  <Tbody>
   {#each items as a (a.id)}
    <TbodyTr>
     <Td align="center">{a.id}</Td>
     <Td>{a.username}</Td>
     <Td align="center">{new Date(a.created).toLocaleString()}</Td>
     <Td align="center">
      <Icons>
       <Icon img="img/edit.svg" alt="Edit" onClick={() => clickAddEdit(a.id)} />
       <Icon img="img/del.svg" alt="Delete" onClick={() => clickDel(a.id, a.username)} />
      </Icons>
     </Td>
    </TbodyTr>
   {/each}
  </Tbody>
 </Table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
</Page>

<Modal title={adminID ? 'Edit the admin' : 'Add a new admin'} body={ModalAdminsAdd} params={{ onSubmit: reloadItems, id: adminID }} bind:show={isModalAddEditOpen} />
<Modal title="Delete the admin" body={ModalItemDel} params={{ onSubmit: reloadItems, id: adminID }} bind:show={isModalDelOpen} />
