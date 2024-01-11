<script lang="ts">
	import logo_apple from '$lib/image/apple_logo.png';
	import { clickOutside } from '$lib/utils/clickoutside';
	import { fadeIn, fadeOut } from '$lib/utils/fade';
	import StatusbarTime from './StatusbarTime.svelte';
	import Siri from '../SVG/system/siri/Siri.svelte';
	import Wifi from '../SVG/system/wifi/Wifi.svelte';
	import Battery from '../SVG/system/battery/Battery.svelte';
	import ActionToggle from '../SVG/system/action/ActionToggle.svelte';

	let currentPosition: number = 0;
	let show: boolean = false;

	let sub = [
		{
			name: 'About This Mac',
			type: 'button'
		},
		{
			name: '',
			type: 'divider'
		},
		{
			name: 'System Settings',
			type: 'button'
		},
		{
			name: 'App Store',
			type: 'button'
		},
		{
			name: '',
			type: 'divider'
		},
		{
			name: 'Sleep',
			type: 'button'
		},
		{
			name: 'Restart',
			type: 'button'
		},
		{
			name: 'Shutdown',
			type: 'button'
		},
		{
			name: '',
			type: 'divider'
		},
		{
			name: 'LockScreen',
			type: 'button'
		},
		{
			name: 'Log Out',
			type: 'button'
		}
	];
	export let menu: Array<{
		name: string;
		submenu: Array<{
			name: string,
			type: 'button' | 'divider'
		}>
	}> = [
		{
			name: 'File',
			submenu: sub
		},
		{
			name: 'Edit',
			submenu: sub
		},
		{
			name: 'Selection',
			submenu: sub
		},
		{
			name: 'View',
			submenu: sub
		},
		{
			name: 'Go',
			submenu: sub
		},
		{
			name: 'Run',
			submenu: sub
		},
		{
			name: 'Terminal',
			submenu: sub
		}
	];
</script>

<div class="w-full h-full flex flex-row place-content-between select-none">
	<div class="place-self-center h-full flex flex-row">
		<img
			class="status"
			on:click={(e)=>{
					show=true
					currentPosition = e.target.offsetLeft
			}}
			src={logo_apple} alt="" />
		<button
			on:click={(e)=>{
					show=true
					currentPosition = e.target.offsetLeft
			}}
			class="text-white font-bold text-xs px-2 focus:bg-gray-300 focus:bg-opacity-60 rounded-sm">Finder</button>
		{#each menu as bar}
			<button
				on:click={(e)=>{
					show=true
					currentPosition = e.target.offsetLeft
				}}
				class="mx-0.5 min-w-max h-full text-white text-center text-xs cursor-default focus:bg-gray-300 focus:bg-opacity-60 rounded-sm px-3">
				{bar.name}
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
{#if show}
	<div
		class="sticky backdrop-blur-3xl bg-gray-400/100 max-w-max py-1 px-1 select-none rounded-md my-1 mx-1 flex flex-col"
		style="z-index: 999;left: {currentPosition}px;"
		in:fadeIn
		out:fadeOut
		use:clickOutside={{callback:()=>{
			show=false
			return true
		}}}
	>
		{#each sub as s }
			{#if s.type === 'button'}
				<button on:click={()=>{
					show=false
				}} class="text-start text-gray-900 text-xs pr-16 pl-2 rounded-md py-0.5 hover:bg-blue-500 hover:text-white">
					{s.name}
				</button>
			{:else }
				<div class="divider-menu-item" />
			{/if}
		{/each}
	</div>
{/if}
<style>
    .status {
        @apply min-w-max h-full py-0.5 mx-1;
    }

    .divider-menu-item {
        @apply h-[0.05rem] w-full bg-gray-500 rounded-md my-0.5;
    }
</style>