<script>
 import { onMount } from 'svelte';
 import { usersAdd, usersEdit, userInfo } from '../core.js';
 import Button from '../components/button.svelte';
 export let onClose;
 export let id = null;
 let userElement;
 let userData = null;
 let error = null;

 onMount(() => {
  if (id) {
   userInfo(id, res => {
    userData = res?.data;
   });
  }
  userElement.focus();
 });

 function clickAddEdit() {
  if (userElement.value) {
   if (id) {
    usersEdit(id, userElement.value, res => {
     if (res?.error === 0) onClose(true);
     else if (res?.message) error = res.message;
    });
   } else {
    usersAdd(userElement.value, res => {
     if (res?.error === 0) onClose(true);
     else if (res?.message) error = res.message;
    });
   }
  }
 }

 function keyEnter() {
  if (event.key === 'Enter') {
   event.preventDefault();
   clickAddEdit();
  }
 }
</script>

<style>
 .group {
  display: flex;
  align-items: center;
  gap: 10px;
 }

 .group .label {
  font-size: 15px;
  padding-left: 5px;
  font-weight: bold;
 }

 .error {
  display: flex;
  gap: 5px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f33;
 }
</style>

<div class="group">
 <div class="label">Username:</div>
 <div><input type="text" value={userData ? userData.name : ''} placeholder="Username" on:keydown={keyEnter} bind:this={userElement} /></div>
 <Button on:click={clickAddEdit} text={id ? 'Edit' : 'Add'} />
</div>
{#if error}
 <div class="error">
  <div class="bold">Error:</div>
  <div>{error}</div>
 </div>
{/if}
