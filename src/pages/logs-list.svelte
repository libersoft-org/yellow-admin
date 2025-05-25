<script>
 import { logsList } from '../core.js';
 import Page from '../components/page.svelte';
 import MenuButton from '../components/menu-button.svelte';
 import ColumnHeader from '../components/table-column-header.svelte';
 import LazyLoader from '../components/lazy-loader.svelte';
 import Buttons from '../components/buttons.svelte';
 import Button from '../components/button.svelte';
 import Input from '../components/input.svelte';
 import Select from '../components/select.svelte';
 import SelectOption from '../components/select-option.svelte';
 import Table from '../components/table.svelte';
 import Thead from '../components/table-thead.svelte';
 import TheadTr from '../components/table-thead-tr.svelte';
 import Tbody from '../components/table-tbody.svelte';
 import TbodyTr from '../components/table-tbody-tr.svelte';
 import Td from '../components/table-td.svelte';
 export let contentElement;
 let items = [];
 let filterLevel = '';
 let filterTopic = '';
 let filterMessage = '';
 let filterFromDate = '';
 let filterToDate = '';
 let filterOffset = 0;
 let lazyLoader;
 let sortBy = 'created';
 let sortDir = 'DESC';

 const levelNames = {
  10: 'TRACE',
  20: 'DEBUG',
  30: 'INFO',
  40: 'WARN',
  50: 'ERROR',
  60: 'FATAL'
 };

 const levelColors = {
  10: '#888',
  20: '#00F',
  30: '#080',
  40: '#FA0',
  50: '#F00',
  60: '#A00'
 };

 function reloadItems() {
  lazyLoader.reload(
   {
    filterLevel: filterLevel || null,
    filterTopic: filterTopic || null,
    filterMessage: filterMessage || null,
    filterFromDate: filterFromDate || null,
    filterToDate: filterToDate || null
   },
   filterOffset
  );
 }

 async function loadItems(show_items_callback, count, offset, filters) {
  logsList(res => show_items_callback({ error: res.error, items: res.data.logs }), count, offset, filters, sortBy, sortDir);
 }

 function clickSearch() {
  reloadItems();
 }

 function clickReload() {
  filterLevel = '';
  filterTopic = '';
  filterMessage = '';
  filterFromDate = '';
  filterToDate = '';
  filterOffset = 0;
  reloadItems();
 }

 function keySearchForm(event) {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickSearch();
  }
 }

 function formatJson(json) {
  if (!json) return '';
  try {
   return JSON.stringify(json, null, 2);
  } catch {
   return '';
  }
 }
</script>

<style>
 .search {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
 }
 .json-details {
  cursor: pointer;
  color: #00F;
  text-decoration: underline;
 }
 .json-content {
  background: #F5F5F5;
  border: 1px solid #DDD;
  border-radius: 4px;
  padding: 8px;
  margin-top: 8px;
  font-family: monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
  max-width: 600px;
  max-height: 400px;
  overflow: auto;
 }
 .level-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-weight: bold;
  font-size: 11px;
 }
 .message-cell {
  max-width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
 }
</style>

<Page>
 <Buttons>
  <MenuButton />
  <Button img="img/reload.svg" text="Reload" onClick={clickReload} />
 </Buttons>
 <Buttons style="flex-wrap: wrap;">
  <div class="search">
   <div>Level:</div>
   <Select bind:value={filterLevel} style="width: 120px;">
    <SelectOption value="">All levels</SelectOption>
    <SelectOption value="10">TRACE</SelectOption>
    <SelectOption value="20">DEBUG</SelectOption>
    <SelectOption value="30">INFO</SelectOption>
    <SelectOption value="40">WARN</SelectOption>
    <SelectOption value="50">ERROR</SelectOption>
    <SelectOption value="60">FATAL</SelectOption>
   </Select>
  </div>
  <div class="search">
   <div>Topic:</div>
   <Input placeholder="e.g., api, data" bind:value={filterTopic} onKeydown={keySearchForm} />
  </div>
  <div class="search">
   <div>Message:</div>
   <Input placeholder="Search in messages" bind:value={filterMessage} onKeydown={keySearchForm} />
  </div>
  <div class="search">
   <div>From date:</div>
   <Input type="datetime-local" bind:value={filterFromDate} onKeydown={keySearchForm} />
  </div>
  <div class="search">
   <div>To date:</div>
   <Input type="datetime-local" bind:value={filterToDate} onKeydown={keySearchForm} />
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
    <ColumnHeader column="created" name="Timestamp" align="center" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="level" name="Level" align="center" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="topic" name="Topic" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader column="message" name="Message" align="left" bind:sortBy bind:sortDir sortingChanged={() => reloadItems()} />
    <ColumnHeader name="Details" align="center" />
   </TheadTr>
  </Thead>
  <Tbody>
   {#each items as log (log.id)}
    <TbodyTr>
     <Td align="center">{log.id}</Td>
     <Td align="center">{new Date(log.created).toLocaleString()}</Td>
     <Td align="center">
      <span class="level-badge" style="background-color: {levelColors[log.level]}20; color: {levelColors[log.level]};">
       {levelNames[log.level] || log.level}
      </span>
     </Td>
     <Td>{log.topic || '-'}</Td>
     <Td>
      <div class="message-cell" title={log.message}>
       {log.message || '-'}
      </div>
     </Td>
     <Td align="center">
      {#if log.json}
       <details>
        <summary class="json-details">JSON</summary>
        <pre class="json-content">{formatJson(log.json)}</pre>
       </details>
      {/if}
     </Td>
    </TbodyTr>
   {/each}
  </Tbody>
 </Table>
 <LazyLoader bind:this={lazyLoader} {loadItems} {contentElement} bind:items />
</Page>
