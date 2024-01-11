<script>
	import Cupertino from '../components/framework/Cupertino.svelte';
	import TrafficLight from '../components/systemUI/TrafficLight.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatcher = createEventDispatcher();

</script>

<Cupertino on:down={()=>{
	dispatcher("headerDown",{})
}}>
	<TrafficLight
		slot="appbar"
		on:close={()=>{}}
		on:minimize={()=>{}}
		on:maximize={()=>{}}
	/>
	<p>Finder app</p>
</Cupertino>