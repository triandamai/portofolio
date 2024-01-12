<script lang="ts">
	import logo_apple from '$lib/image/apple_logo.png';
	import StatusbarTime from './StatusbarTime.svelte';
	import Siri from '../SVG/system/siri/Siri.svelte';
	import Wifi from '../SVG/system/wifi/Wifi.svelte';
	import Battery from '../SVG/system/battery/Battery.svelte';
	import ActionToggle from '../SVG/system/action/ActionToggle.svelte';
	import type { Application, OptionsMenu, SystemToolbarMenu } from '$lib/manifest/application.manifest';
	import { createEventDispatcher } from 'svelte';
	import AppleLogo from '../SVG/system/logo/AppleLogo.svelte';

	let dispatcher = createEventDispatcher();
	let statusbar: HTMLDivElement;
	export let applicationContext: Application | null;
	export let systemContextMenu: Array<OptionsMenu> = [];
	export let systemToolbarMenu: Array<SystemToolbarMenu> = [];


	function hideContextMenu() {
		dispatcher('hideMenuContext', {});
	}

	function showContextMenu(
		opt: Array<OptionsMenu> = [],
		x: number = 0
	) {
		dispatcher('showMenuContext', {
			x: x,
			y: (statusbar.offsetTop + statusbar.clientHeight),
			contextMenu: opt
		});
	}
</script>

<div bind:this={statusbar}
		 class="backdrop-blur-md bg-white/10 opacity-90 w-screen h-full flex flex-row place-content-between select-none">
	<div class="place-self-center h-full flex flex-row">
		<AppleLogo
			on:down={()=>{
				showContextMenu(systemContextMenu,5)
			}}
		/>
		{#if applicationContext}
			<button
				on:click={(e)=>{
					showContextMenu(
						applicationContext?.options ?? [],
						e.target.offsetLeft
					)
				}}
				class="text-white font-bold text-xs px-2 rounded-sm focus:bg-gray-300 focus:bg-opacity-60">{applicationContext?.name ?? ''}</button>
		{/if}
		{#each systemToolbarMenu as tool}
			<button
				on:click={(e)=>{
					showContextMenu(
						tool.contextMenu,
						e.target.offsetLeft
					)
				}}
				class="mx-0.5 min-w-max h-full text-white text-center text-xs cursor-default focus:bg-gray-300 focus:bg-opacity-60 rounded-sm px-3">
				{tool.name}
			</button>
		{/each}
	</div>
	<div class="place-self-center flex flex-row">
		<Battery battery={50} />
		<Wifi state={'no-connection'} />
		<ActionToggle />
		<Siri />
		<StatusbarTime />
	</div>
</div>
<style>
    .status {
        @apply min-w-max h-full py-0.5 mx-1;
    }
</style>