<script>
 import { hideSidebarMobile } from '../core.js';
 import BaseButton from './base-button.svelte';

 function clickMenu() {
  hideSidebarMobile.set(false);
 }
</script>

<style>
 .menu-button {
  display: none;
  background-color: #222;
  border-radius: 50%;
  padding: 15px;
  width: 20px;
  height: 20px;
  cursor: pointer;
 }

 .menu-button img {
  width: 20px;
  height: 20px;
 }

 @media (max-width: 768px) {
  .menu-button {
   display: flex;
  }
 }
</style>

<BaseButton onClick={clickMenu} data-testid="menu-button">
 <div class="menu-button">
  <img src="img/menu.svg" alt="☰" />
 </div>
</BaseButton>
