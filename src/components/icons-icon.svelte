<script>
 import BaseButton from './base-button.svelte';
 export let img;
 export let alt;
 export let onClick;
</script>

<style>
 .icon {
  display: flex;
  padding: 5px;
  cursor: pointer;
 }

 img {
  width: 20px;
  height: 20px;
 }
</style>

<BaseButton {onClick}>
 <div class="icon">
  <img src={img} {alt} />
 </div>
</BaseButton>
