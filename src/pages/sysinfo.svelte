<script>
 import { onMount } from 'svelte';
 import { hideSidebarMobile, sysInfoList, humanSize } from '../core.js';
 import ProgressBar from '../components/progressbar.svelte';
 import Button from '../components/button.svelte';
 let sysInfo = null;
 let cpuSummary;

 onMount(() => showTable());

 function showTable() {
  sysInfoList(res => {
   cpuSummary = groupCPUs(res.data.cpu.cpus);
   sysInfo = res.data;
  });
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

 function clickReload() {
  showTable();
 }

 function groupCPUs(cpus) {
  const counts = {};
  cpus.forEach(cpu => {
   counts[cpu] = (counts[cpu] || 0) + 1;
  });
  const result = [];
  for (const cpu in counts) result.push(`${counts[cpu]}x ${cpu}`);
  return result;
 }
</script>

<style>
 .sysinfo {
  border-spacing: 0;
  border: 1px solid #000;
  border-radius: 10px;
  overflow: hidden;
 }

 .sysinfo th,
 .sysinfo td {
  padding: 10px;
  vertical-align: top;
 }

 .sysinfo tr th {
  background-color: #222;
  color: #fff;
  text-align: right;
 }

 .sysinfo tr td {
  background-color: #ffdd1130;
 }

 .sysinfo tr td:hover {
  background-color: #fd1;
 }

 .title {
  font-size: 20px;
  font-weight: bold;
 }

 .networks .network {
  margin: 20px 0;
 }
</style>

<div class="page">
 <div class="buttons">
  <div class="menu-button" role="button" tabindex="0" on:click={clickMenu} on:keydown={keyMenu}>
   <img src="img/menu.svg" alt="☰" />
  </div>
  <Button on:click={() => clickReload()} img="img/reload.svg" text="Reload" />
 </div>
 {#if sysInfo}
  <div class="title">Application</div>
  <table class="sysinfo">
   <tbody>
   <tr>
    <th>Application name:</th>
    <td>{sysInfo.app.name}</td>
   </tr>
   <tr>
    <th>Version:</th>
    <td>{sysInfo.app.version}</td>
   </tr>
   </tbody>
  </table>
  <div class="title">System</div>
  <table class="sysinfo">
   <tbody>

   <tr>
    <th>OS:</th>
    <td>{sysInfo.os.name} {sysInfo.os.version}</td>
   </tr>
   <tr>
    <th>Host name:</th>
    <td>{sysInfo.hostname}</td>
   </tr>
   <tr>
    <th>Uptime:</th>
    <td>{sysInfo.uptime}</td>
   </tr>
   </tbody>
  </table>
  <div class="title">System resources</div>
  <table class="sysinfo">
   <tbody>
   <tr>
    <th>CPU(s):</th>
    <td>
     {#each cpuSummary as c}
      <div>{c}</div>
     {/each}
    </td>
   </tr>
   <tr>
    <th>CPU architecture:</th>
    <td>{sysInfo.cpu.arch}</td>
   </tr>
   <tr>
    <th>CPU load: </th>
    <td>
     <ProgressBar value={sysInfo.cpu.load} />
    </td>
   </tr>
   <tr>
    <th>RAM:</th>
    <td>
     <div>Used: {humanSize(sysInfo.ram.total - sysInfo.ram.free)}</div>
     <div>Free: {humanSize(sysInfo.ram.free)}</div>
     <div>Total: {humanSize(sysInfo.ram.total)}</div>
     <div><ProgressBar value={(((sysInfo.ram.total - sysInfo.ram.free) / sysInfo.ram.total) * 100).toFixed(2)} /></div>
    </td>
   </tr>
   <tr>
    <th>Network:</th>
    <td>
     {#if sysInfo.networks}
      {#each Object.keys(sysInfo.networks) as nis}
       <div class="networks">
        <div class="bold">{nis}:</div>
        {#each sysInfo.networks[nis] as ni}
         <div class="network">
          <div>Address: {ni.address}</div>
          <div>CIDR: {ni.cidr}</div>
          <div>Netmask: {ni.netmask}</div>
          <div>Family: {ni.family}</div>
          <div>MAC: {ni.mac}</div>
          <div>Internal: {ni.internal ? 'Yes' : 'No'}</div>
          {#if ni.scope_id}
           <div>Scope ID: {ni.scope_id}</div>
          {/if}
         </div>
        {/each}
       </div>
      {/each}
     {/if}
    </td>
   </tr>
   </tbody>
  </table>
 {/if}
</div>
