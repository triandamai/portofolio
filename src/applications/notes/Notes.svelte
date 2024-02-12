<script lang="ts">
	import type { Application } from '$lib/core/framework/application';
	
	import Cupertino from '../../components/framework/Cupertino.svelte';

	export let width:number
	export let height:number
	export let context:Application

</script>

<Cupertino
	layout={'basic-sidebar'}
	appWidth={width}
	appHeight={height}
	context={context}
	
>
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