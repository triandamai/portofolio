<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatcher = createEventDispatcher()

	export let id:string = ''
</script>
<button id={id} on:click={()=>dispatcher("click",{})} {...$$props}>
	<slot />
</button>

<style lang="scss">
  button {
    color: inherit;
    text-decoration: none;
    vertical-align: middle;

    border: 0;
    border-radius: 0;

    outline: 0;

    margin: 0;
    padding: 0;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    position: relative;

    user-select: none;

    appearance: none;

    background-color: transparent;

    -webkit-tap-highlight-color: transparent;

    &:not(:disabled) {
      cursor: pointer;
    }
  }
</style>