<script>
 import Core from "../core.js";

 export let title;
 export let icon;
 export let callback;
 export let active = false;

 function clickFunction() {
  callback();
 }

 function keyFunction(name) {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   callback();
  }
 }

</script>

<style>
 .item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  font-weight: bold;
  border-bottom: 1px solid #444;
  cursor: pointer;
 }

 .item:hover {
  background-color: #333;
 }

 .item.active {
  background-color: #555;
 }

 .item img {
  width: 32px;
  height: 32px;
 }
</style>

<div class="item {active ? 'active' : ''}" role="button" tabindex="0" on:click={clickFunction} on:keydown={keyFunction}>
 <img src="img/{icon}" alt={title} />
 <div>{title}</div>
</div>
