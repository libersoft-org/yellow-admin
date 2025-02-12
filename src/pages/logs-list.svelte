<script>
 import Buttons from '../components/buttons.svelte';
 import Button from '../components/button.svelte';
 import MenuButton from '../components/menu-button.svelte';

 function clickReload() {
  console.log('TODO: clickReload');
 }
</script>

<Buttons>
 <MenuButton />
 <Button img="img/reload.svg" text="Reload" onClick={() => clickReload()} />
</Buttons>
