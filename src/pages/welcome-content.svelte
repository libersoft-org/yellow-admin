<script>
 import BaseButton from '../components/base-button.svelte';
 import { product, version, build, commit, link } from '../core.js';

 function clickLogo() {
  window.open(link, '_blank');
 }

 function keyLogo() {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   clickLogo();
  }
 }
</script>

<style>
 .welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 100%;
 }

 .welcome .logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
 }

 .welcome .logo img {
  width: 150px;
  max-width: 80%;
 }

 .welcome .logo .product {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
 }

 .welcome .version {
  display: flex;
  gap: 5px;
  font-size: 16px;
 }
</style>

<div class="welcome">
 <BaseButton onClick={clickLogo}>
  <div class="logo">
   <img src="img/logo.svg" alt={product} />
   <div class="product">{product}</div>
  </div>
 </BaseButton>
 <div class="version">
  <div>Version:</div>
  <div class="bold">{version}</div>
 </div>
 <div class="version">
  <div>Build:</div>
  <div class="bold">{build}</div>
 </div>
 <div class="version">
  <div>Commit:</div>
  <div class="bold">{commit}</div>
 </div>
</div>
