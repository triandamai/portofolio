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
		subscribe('selected-menu', 'notes', (data) => {
			console.log('on toolbar menu selected', {
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
	style={'basic-sidebar'}
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

	<div
		slot="sidebar"
		class="px-2"
	>
		This is sidebar
	</div>
	<div
		slot="header"
		class="h-full bg-white rounded-tr-md px-2 py-1 flex flex-col place-content-center"
	>
		Note App By Trian Damai
	</div>
	<!--	Content	-->
	<div class="h-full bg-white px-2 overflow-y-scroll rounded-br-md">
		{#each Array(30) as _, i}
			<p class="font-sf-regular">Notes app</p>
		{/each}
	</div>
</Cupertino>