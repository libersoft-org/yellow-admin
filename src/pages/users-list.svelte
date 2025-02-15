<script>
 import { onMount } from 'svelte';
 import { usersList, domainsList, usersDel } from '../core.js';
 import Page from '../components/page.svelte';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Buttons from '../components/buttons.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Select from '../components/select.svelte';
 import Option from '../components/select-option.svelte';
 import Modal from '../components/modal.svelte';
 import ModalUsersAdd from '../modals/modal-users-add-edit.svelte';
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
 let domains = [];
 let items = [];
 let isModalAddEditOpen = false;
 let isModalDelOpen = false;
 let userID = null;
 let delAddress = null;
 let filterUsername = null;
 let filterOffset = 0;
 let lazyLoader;
 let sortBy = 'id';
 let sortDir = 'ASC';
 let elDomain;

 onMount(() => {
  domainsList(
   res => {
    if (res.error === false) domains = res.data.domains;
   },
   1000000,
   0,
   null,
   'id',
   'ASC'
  );
 });

 function reloadItems() {
  lazyLoader.reload({ username: filterUsername, domainID: elDomain.value }, filterOffset);
 }

 async function loadItems(show_items_callback, count, offset, filters) {
  //console.log('loadItems count:', count, 'offset:', offset, 'sortBy:', sortBy, 'sortDir:', sortDir, 'filters:', filters);
  usersList(res => show_items_callback({ error: res.error, items: res.data.users }), count, offset, filters, sortBy, sortDir);
 }

 function clickAddEdit(id = null) {
  userID = id;
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

 function clickDel(id, username) {
  userID = id;
  delAddress = username;
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
  <Button img="img/add.svg" text="Add a new user" onClick={() => clickAddEdit()} />
  <Button img="img/reload.svg" text="Reload" onClick={clickReload} />
 </Buttons>
 <Buttons>
  <div class="search">
   <div>Username:</div>
   <Input placeholder="Username" bind:value={filterUsername} onKeydown={keySearchForm} />
  </div>
  <div class="search">
   <div>@</div>
   <Select bind:this={elDomain}>
    <Option text="--- domain ---" selected={true} disabled={true} />
    {#each domains as d (d.id)}
     <Option value={d.id} text={d.name} />
    {/each}
   </Select>
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
    <ColumnHeader column="address" name="Address" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="visible_name" name="Visible name" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="created" align="center" name="Created" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader align="center" name="Action" />
   </TheadTr>
  </Thead>
  <Tbody>
   {#each items as u (u.id)}
    <TbodyTr>
     <Td align="center">{u.id}</Td>
     <Td>{u.address}</Td>
     <Td>{u.visible_name}</Td>
     <Td align="center">{new Date(u.created).toLocaleString()}</Td>
     <Td align="center">
      <Icons>
       <Icon img="img/edit.svg" onClick={() => clickAddEdit(u.id)} />
       <Icon img="img/del.svg" onClick={() => clickDel(u.id, u.address)} />
      </Icons>
     </Td>
    </TbodyTr>
   {/each}
  </Tbody>
 </Table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
</Page>

<Modal title={userID ? 'Edit the user (ID: ' + userID + ')' : 'Add a new user'} body={ModalUsersAdd} params={{ onSubmit: reloadItems, id: userID }} bind:show={isModalAddEditOpen} />
<Modal title="Delete the user" body={ModalItemDel} params={{ onSubmit: reloadItems, fn: usersDel, id: userID, name: delAddress }} bind:show={isModalDelOpen} />
