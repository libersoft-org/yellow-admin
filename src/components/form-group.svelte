<script>
 export let label = '';
</script>

<style>
 .group {
  display: flex;
  flex-direction: column;
  gap: 5px;
 }

 .group .label {
  font-size: 15px;
  font-weight: bold;
 }
</style>

<div class="group" {...$$restProps}>
 <div class="label">{label}:</div>
 <slot></slot>
</div>
