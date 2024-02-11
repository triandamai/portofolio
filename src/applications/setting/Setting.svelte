<script lang="ts">
	import type { Application } from '$lib/core/framework/framework';
	import Cupertino from '../../components/framework/Cupertino.svelte';
	import TrafficLight from '../../components/systemUI/TrafficLight.svelte';
	export let context: Application;
	export let width: number;
	export let height: number;
</script>

<Cupertino
	style="basic-sidebar"
	appWidth={width}
	appHeight={height}
	{context}
	on:enableMove
	on:windowActive
>
	<TrafficLight slot="appbar" />
	<div slot="sidebar">
		<p>sidebar</p>
	</div>
	<div slot="header"><p>Header</p></div>
	<div><p>content</p></div>
</Cupertino>
