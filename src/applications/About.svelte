<script lang="ts">
	import Cupertino from '../components/framework/Cupertino.svelte';
	import TrafficLight from '../components/systemUI/TrafficLight.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatcher = createEventDispatcher();
	export let width:number
	export let height:number

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
	<p>About app</p>
</Cupertino>