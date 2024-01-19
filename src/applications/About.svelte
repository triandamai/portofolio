<script lang="ts">
	import type { Application } from '$lib/kernel/type';
	import Cupertino from '../components/framework/Cupertino.svelte';
	import TrafficLight from '../components/systemUI/TrafficLight.svelte';

	export let width:number
	export let height:number
	export let context:Application


</script>

<Cupertino
	appWidth={width}
	appHeight={height}
	context={context}
	on:enableMove
	on:windowActive
>
	<TrafficLight
		slot="appbar"
		on:close
		on:minimize
		on:maximize
	/>
	<div class="flex flex-col">

	</div>
</Cupertino>