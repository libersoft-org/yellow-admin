<script>
 export let type = 'error';
 export let text = '';
 const types = {
  error: { class: 'error', icon: 'error.svg' },
  warning: { class: 'warning', icon: 'warning.svg' },
  success: { class: 'success', icon: 'success.svg' }
 };
</script>

<style>
 .alert {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
 }

 .error {
  background-color: #fcc;
  border: 1px solid #f55;
 }

 .warning {
  background-color: #ffc;
  border: 1px solid #aa0;
 }

 .success {
  background-color: #cfc;
  border: 1px solid #585;
 }

 img {
  display: flex;
  width: 24px;
  height: 24px;
 }
</style>

<div class="alert {types[type].class}">
 <img src="img/{types[type].icon}" alt="" />
 <div>{text}</div>
</div>
