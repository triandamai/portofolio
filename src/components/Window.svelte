<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Dock from '../components/Dock.svelte';
	import Statusbar from '../components/Statusbar.svelte';

	const dispatcher = createEventDispatcher();

	function onDockItemClicked(event: CustomEvent) {
		dispatcher('onItemDock', event.detail);
	}
</script>
<Statusbar />
<div class="z-0 w-screen h-screen flex flex-col justify-center">
	<slot />
</div>
<Dock on:menu={onDockItemClicked} />