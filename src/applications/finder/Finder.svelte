<script lang="ts">
	import type { Application } from '$lib/core/framework/framework';
	import { onMount } from 'svelte';

	import Cupertino from '../../components/framework/Cupertino.svelte';

	export let width: number;
	export let height: number;

	export let context: Application;

	onMount(() => {
		return () => {};
	});
</script>

<Cupertino appWidth={width} appHeight={height} {context}>
	<div class="h-full px-2 overflow-y-scroll">
		{#each Array(30) as _, i}
			<p class="font-sf-regular">Finder app</p>
		{/each}
	</div>
</Cupertino>
