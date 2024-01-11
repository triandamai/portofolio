<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	let header:HTMLDivElement
	let dispatcher=createEventDispatcher()
	onMount(()=>{
		header.addEventListener('mousedown',()=>{
			dispatcher('down',{})
		})
	})
</script>
<div class="w-full h-full bg-transparent">
	<div bind:this={header} class="w-full py-2">
		<slot name="appbar"/>
		<div class="divider-disabled"/>
	</div>
	<div class="w-full h-full px-2 py-2">
		<slot />
	</div>
</div>
<style lang="scss">
  .divider-disabled{
    opacity: 100%;
    height: 0px;
    color: #b4b4b4;
  }
</style>