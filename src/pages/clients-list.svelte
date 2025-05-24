<script>
 import { clientsList, clientsKick } from '../core.js';
 import Page from '../components/page.svelte';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Buttons from '../components/buttons.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Modal from '../components/modal.svelte';
 import ModalClientsKick from '../modals/modal-clients-kick.svelte';
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
 let filterIp = null;
 let filterGuid = null;
 let filterOffset = 0;
 let filterUserAddress = null;
 let lazyLoader;
 let sortBy = 'guid';
 let sortDir = 'ASC';
 let clientID = null;
 let isModalKickOpen = false;

 function reloadItems() {
  lazyLoader.reload({ filterIp, filterGuid, filterUserAddress }, filterOffset);
 }

 async function loadItems(show_items_callback, count, offset, filters) {
  clientsList(
   res => {
    show_items_callback({ error: res.error, items: res.data.items });
   },
   count,
   offset,
   filters?.filterIp,
   filters?.filterGuid,
   filters?.filterUserAddress,
   sortBy,
   sortDir
  );
 }

 function clickSearch() {
  reloadItems();
 }

 function clickReload() {
  filterIp = null;
  filterGuid = null;
  filterUserAddress = null;
  filterOffset = 0;
  reloadItems();
 }

 function keySearchForm(event) {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickSearch();
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

<Page>
 <Buttons>
  <MenuButton />
  <Button data-testid="clients-reload-button" img="img/reload.svg" text="Reload" onClick={() => clickReload()} />
 </Buttons>
 <Buttons>
  <div class="search">
   <div>Client's GUID:</div>
   <Input data-testid="clients-filter-guid" placeholder="GUID" bind:value={filterGuid} onKeydown={keySearchForm} />
  </div>
  <div class="search">
   <div>Client's IP address:</div>
   <Input data-testid="clients-filter-ip" placeholder="IP address" bind:value={filterIp} onKeydown={keySearchForm} />
  </div>
  <div class="search">
   <div>User address:</div>
   <Input data-testid="clients-filter-user" placeholder="User address" bind:value={filterUserAddress} onKeydown={keySearchForm} />
  </div>
  <div class="search">
   <div>Offset:</div>
   <Input data-testid="clients-filter-offset" type="number" min="0" placeholder="0" bind:value={filterOffset} onKeydown={keySearchForm} />
  </div>
  <Button data-testid="clients-search-button" img="img/search.svg" text="Search" onClick={clickSearch} />
 </Buttons>
 <Table data-testid="clients-table">
  <Thead>
   <TheadTr>
    <ColumnHeader column="guid" name="ID" align="center" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="ip" name="IP address" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="userAddress" name="User" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader name="Action" />
   </TheadTr>
  </Thead>
  <Tbody>
   {#each items as c (c.guid)}
    <TbodyTr>
     <Td align="center">{c.guid}</Td>
     <Td>{c.ip}</Td>
     <Td>{c.userAddress}</Td>
     <Td>
      <Icons>
       <!--<Icon img="img/kick.svg" onClick={() => clientsKick(c.guid)} />-->
       <Icon
        data-testid="clients-kick-{c.guid}"
        img="img/kick.svg"
        onClick={() => {
         clientID = c.guid;
         isModalKickOpen = true;
        }}
       />
      </Icons>
     </Td>
    </TbodyTr>
   {/each}
  </Tbody>
 </Table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
</Page>

<Modal
 title="Disconnect the client"
 body={ModalClientsKick}
 params={{
  fn: () => {
   clientsKick(clientID, () => {
    reloadItems();
    isModalKickOpen = false;
   });
  },
  id: clientID
 }}
 bind:show={isModalKickOpen}
/>
