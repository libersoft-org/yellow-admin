<script>
 export let elSpinner;
</script>

<style>
 :root {
  --spinner-color: #000;
 }

 .spinner {
  margin: 0 auto;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background:
   radial-gradient(farthest-side, var(--spinner-color) 94%, transparent) top/8px 8px no-repeat,
   conic-gradient(transparent 30%, var(--spinner-color));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), var(--spinner-color) 0);
  animation: spinner 1s infinite linear;
 }

 @keyframes spinner {
  100% {
   transform: rotate(1turn);
  }
 }
</style>

<div class="spinner" bind:this={elSpinner}></div>
