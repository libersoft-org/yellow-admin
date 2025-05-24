<script>
 import { setContext, tick } from 'svelte';
 import BaseButton from './base-button.svelte';
 export let show = false;
 export let params = null;
 export let title = null;
 export let body = '';
 export let width;
 export let height;
 let modalEl;
 let posX = 0;
 let posY = 0;
 let isDragging = false;
 let left;
 let top;
 let showContent = false;

 $: showUpdated(!!(show && body));

 async function showUpdated(show) {
  console.log('showUpdated', show);
  if (show) {
   await tick();
   modalEl.focus();
   showContent = true;
   await tick();
   await positionModal();
  } else {
   showContent = false;
  }
 }

 async function positionModal() {
  if (modalEl) {
   const modalRect = modalEl.getBoundingClientRect();
   top = (window.innerHeight - modalRect.height) / 2;
   left = (window.innerWidth - modalRect.width) / 2;
  }
 }

 async function reposition() {
  await positionModal();
 }

 function close() {
  show = false;
 }

 function clickCloseModal() {
  show = false;
 }

 function dragStart(event) {
  isDragging = true;
  event.preventDefault();
  const modalRect = modalEl.getBoundingClientRect();
  posX = event.clientX - modalRect.left;
  posY = event.clientY - modalRect.top;
  window.addEventListener('mousemove', drag);
  window.addEventListener('mouseup', dragEnd);
 }

 function drag(event) {
  if (isDragging) {
   let x = event.clientX - posX;
   let y = event.clientY - posY;
   const modalWidth = modalEl.offsetWidth;
   const modalHeight = modalEl.offsetHeight;
   const windowWidth = window.innerWidth;
   const windowHeight = window.innerHeight;
   left = Math.max(0, Math.min(windowWidth - modalWidth, x));
   top = Math.max(0, Math.min(windowHeight - modalHeight, y));
  }
 }

 function dragEnd() {
  isDragging = false;
  window.removeEventListener('mousemove', drag);
  window.removeEventListener('mouseup', dragEnd);
 }
</script>

<style>
 .modal {
  z-index: 1000;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  max-width: calc(100% - 20px);
  max-height: calc(100% - 20px);
  overflow: auto;
  border: 1px solid #000;
  border-radius: 10px;
  /*box-sizing: border-box;*/
  box-shadow: var(--shadow);
 }

 .modal .header {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: bold;
  background-color: #fd3;
  color: #000;
 }

 .modal .header .title {
  padding: 0 10px;
  flex-grow: 1;
 }

 .modal .header img {
  display: block;
  width: 20px;
  height: 20px;
  padding: 10px;
 }

 .modal .body {
  padding: 10px;
  overflow-y: auto;
  background-color: #fff;
  color: #000;
 }
</style>

{#if show && body}
 <div class="modal" style="top: {top}px; left: {left}px;" bind:this={modalEl} data-testid="modal">
  <div class="header" role="none" on:mousedown={dragStart}>
   <div class="title">{title}</div>
   <BaseButton onClick={clickCloseModal} data-testid="modal-close">
    <div class="close">
     <img src="img/close-black.svg" alt="X" />
    </div>
   </BaseButton>
  </div>
  <div class="body">
   {#if params}
    <svelte:component this={body} {close} {reposition} {params} />
   {:else}
    <svelte:component this={body} {close} {reposition} />
   {/if}
  </div>
 </div>
{/if}
