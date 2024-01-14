<script lang="ts">
	import Cupertino from '../components/framework/Cupertino.svelte';
	import TrafficLight from '../components/systemUI/TrafficLight.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { Os } from '$lib/manifest/application.manifest';


	const dispatcher = createEventDispatcher();
	const { subscribe, unsubscribe, getOs } = Os();

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
	on:down={()=>{
	dispatcher("move",{})
}}>
	<TrafficLight
		slot="appbar"
		on:close={()=>{
			dispatcher('close', {})
		}}
		on:minimize={()=>{
			dispatcher('minimize', {})
		}}
		on:maximize={()=>{
			dispatcher('maximize', {})
		}}
	/>
	<div class="h-full px-2 overflow-y-scroll">
		{#each Array(30) as _, i}
			<p class="font-sf-regular">Finder app</p>
		{/each}
	</div>
</Cupertino>