<script>
 export let product;
 export let version;
 export let link;

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
 <div class="logo" role="button" tabindex="0" on:click={clickLogo} on:keydown={keyLogo}>
  <img src="img/logo.svg" alt={product} />
  <div class="product">{product}</div>
 </div>
 <div class="version">
  <div>Version:</div>
  <div class="bold">{version}</div>
 </div>
</div>
