<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let bg = '#FFFFFF';
	let header: HTMLDivElement;
	let dispatcher = createEventDispatcher();

	onMount(() => {
		header.addEventListener('mousedown', () => {
			dispatcher('down', {  });
		});
	});

</script>
<div
	bind:this={header}
	class=" w-full py-3  flex flex-row justify-start rounded-tl-md rounded-tr-md"
	style="background-color: {bg};"
>
	<slot />
</div>
