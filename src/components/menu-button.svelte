<script>
 import { hideSidebarMobile } from '../core.js';

 function clickMenu() {
  hideSidebarMobile.set(false);
 }

 function keyMenu() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickMenu();
  }
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

<div class="menu-button" role="button" tabindex="0" on:click={clickMenu} on:keydown={keyMenu} >
 <img src="img/menu.svg" alt="☰" />
</div>
