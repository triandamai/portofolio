<script lang="ts">
	import Cupertino from '../components/framework/Cupertino.svelte';
	import TrafficLight from '../components/systemUI/TrafficLight.svelte';
	import {closeApplication,minimizeApplication,maximizeApplication } from '$lib/kernel/kernel';
	import type { Application, OptionsMenu } from '$lib/kernel/type';
	import { onMount } from 'svelte';
	import { subscribe, unsubscribe } from '$lib/kernel/application/application';

	export let width:number
	export let height:number

	export let context:Application

	onMount(()=>{
		subscribe(context.appID,context.appID,{
			onMaximize: function (width: number, height: number, x: number, y: number): void {
				console.log('Function not implemented. maximize');
			},
			onMinimize: function (width: number, height: number): void {
				console.log('Function not implemented. minimize');
			},
			onPositionChanged: function (x: number, y: number): void {
				console.log('Function not implemented. position changed');
			},
			onStatusbarSelected: function (menu: OptionsMenu): void {
				console.log('Function not implemented. status bar selected');
			},
			onOpenApplication: function (): void {
				console.log('Function not implemented. opening');
			},
			onCloseApplication: function (): void {
				console.log('Function not implemented. closing');
			}
		})

		return ()=>{
			unsubscribe(context.appID,context.appID)
		}
	})
</script>

<Cupertino
	appWidth={width}
	appHeight={height}
	context={context}
>
	<TrafficLight
		slot="appbar"
		on:close={e=>closeApplication(context)}
		on:minimize={e=>minimizeApplication(context)}
		on:maximize={e=>maximizeApplication(context)}
	/>
	<div class="h-full px-2 overflow-y-scroll">
		{#each Array(30) as _, i}
			<p class="font-sf-regular">Finder app</p>
		{/each}
	</div>
</Cupertino>