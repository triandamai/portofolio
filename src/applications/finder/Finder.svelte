<script lang="ts">
	import type { Application } from '$lib/core/framework/application';
	import { onMount } from 'svelte';

	import Cupertino from '../../components/framework/Cupertino.svelte';

	export let width: number;
	export let height: number;

	export let context: Application;

	function initContext(context: Application) {
		context.addOnTrafficLightListener('app',{
			onRed(){

			},
			onYellow(){

			},
			onGreen(){
				if(context.getIsFullScreen()) {
					context.exitFullScreen()
				}else {
					context.enterFullScreen()
				}
			}
		})
	}

	$: initContext(context)

	onMount(() => {

		return () => {

		};
	});
</script>

<Cupertino
	layout={'basic-sidebar'}
	appWidth={width}
	appHeight={height}
	context={context}
>
	<div class="h-full px-2 overflow-y-scroll">
		{#each Array(30) as i}
			<p class="font-sf-regular" aria-label={i}>Finder app</p>
		{/each}
	</div>
</Cupertino>
