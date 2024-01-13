<script>
	import Cupertino from '../components/framework/Cupertino.svelte';
	import TrafficLight from '../components/systemUI/TrafficLight.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatcher = createEventDispatcher();

</script>

<Cupertino
	on:down={()=>{
	dispatcher("headerDown",{})
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