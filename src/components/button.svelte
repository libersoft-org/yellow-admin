<script>
  import { createEventDispatcher } from 'svelte';

  export let img = '';
  export let text = '';
  export let disabled = false;

  export let role = 'button';
  export let tabindex = 0;

  const dispatch = createEventDispatcher();

  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      dispatch('click');
    }
  }
</script>

<div class="button {disabled ? 'disabled' : ''}" role={role} tabindex={tabindex} on:click on:keydown={handleKeydown}>
 <slot>
  {#if img}
   <img src={img} alt={text} />
  {/if}
  <div>{text}</div>
 </slot>
</div>

<style>
 .button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  text-align: center;
  padding: 10px;
  border: 1px solid #b90;
  border-radius: 10px;
  background-color: #fd1;
  font-weight: bold;
  cursor: pointer;
}

.button.disabled {
 border: 1px solid #888;
 background-color: #bbb;
}

.button img {
 width: 20px;
 height: 20px;
}


</style>
