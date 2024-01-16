<script lang="ts">
	import Cupertino from '../components/framework/Cupertino.svelte';
	import TrafficLight from '../components/systemUI/TrafficLight.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { Os } from '$lib/manifest/application.manifest';


	const dispatcher = createEventDispatcher();
	const { subscribe, unsubscribe, getOs } = Os();
	export let width:number
	export let height:number

	onMount(() => {
		subscribe('selected-menu', 'finder', (data) => {
			console.log('geheh', {
				data,
				os: getOs()
			});
		});

		return () => {
			unsubscribe('selected-menu', 'finder');
		};
	});
</script>

<Cupertino
	appWidth={width}
	appHeight={height}
	on:enableMove
	on:windowActive
>
	<TrafficLight
		slot="appbar"
		on:close
		on:minimize
		on:maximize
	/>
	<div class="h-full px-2 overflow-y-scroll">
		{#each Array(30) as _, i}
			<p class="font-sf-regular">Finder app</p>
		{/each}
	</div>
</Cupertino>