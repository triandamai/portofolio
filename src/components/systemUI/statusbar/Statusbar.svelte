<script lang="ts">
	import type { ApplicationState, OsKernel } from '$lib/core/type';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { OptionsMenu } from '$lib/core/type';
	import { sineInOut } from 'svelte/easing';
	import { currentApplication } from '$lib/core/application';
	import { fly } from 'svelte/transition';

	import StatusbarTime from './StatusbarTime.svelte';
	import Siri from '../../SVG/system/siri/Siri.svelte';
	import Wifi from '../../SVG/system/wifi/Wifi.svelte';
	import Battery from '../../SVG/system/battery/Battery.svelte';
	import ActionToggle from '../../SVG/system/action/ActionToggle.svelte';
	import AppleLogo from '../../SVG/system/logo/AppleLogo.svelte';

	const dispatcher = createEventDispatcher();
	let statusbar: HTMLDivElement;
	let isShow: boolean = true;

	export let macos: OsKernel;
	export let applicationContext: ApplicationState | null;

	export function show() {
		if (!isShow) {
			isShow = true;
		}
	}

	export function hide() {
		isShow = false;
	}

	export function getStatusbarInfo(): { x: number; y: number; height: number ,isShow:boolean} {
		if (statusbar) {
			return {
				x: statusbar.clientLeft,
				y: statusbar.clientTop,
				height: statusbar.clientHeight,
				isShow:isShow
			};
		}
		return { x: 0, y: 0, height: 0,isShow:isShow };
	}

	function showContextMenu(e: MouseEvent, menu: Array<OptionsMenu> = []) {
		const x = (e.target as HTMLElement).offsetLeft;
		dispatcher('showMenuContext', {
			x: x,
			y: statusbar.offsetTop + statusbar.clientHeight,
			contextMenu: menu
		});
	}
	function showSystemContextMenu() {
		dispatcher('showMenuContext', {
			x: 5,
			y: statusbar.offsetTop + statusbar.clientHeight,
			contextMenu: macos.menuToolbarSystem
		});
	}
	onMount(() => {
		isShow = true;
	});
</script>

{#if isShow}
	<div
		in:fly={{
			easing: sineInOut,
			duration: 400,
			x: 0,
			y: -50
		}}
		out:fly={{
			easing: sineInOut,
			duration: 400,
			x: 0,
			y: -50
		}}
		bind:this={statusbar}
		class="container-status-bar"
	>
		<div class="{$currentApplication?.size === 'max' ?'bg-status-bar-max' : 'bg-status-bar'}">
			<div class="container-item-status-bar">
				<AppleLogo
					on:click={showSystemContextMenu}
					class="h-5 mx-2 place-self-center {$currentApplication?.size === 'max' ?'fill-white' : 'fill-gray-900 dark:fill-white'}"
				/>
				{#each applicationContext?.context?.tools ?? macos.toolbarSystem as tool}
					{#if tool.name === applicationContext?.context?.name}
						<button
							on:click={(e) => showContextMenu(e, tool.contextMenu)}
							class="{$currentApplication?.size === 'max' ?'active-application-max' : 'active-application '}"
							type="button"
						>
							{applicationContext?.context?.name ?? ''}
						</button>
					{:else}
						<button
							on:click={(e) => showContextMenu(e, tool.contextMenu)}
							class="{$currentApplication?.size === 'max' ?'item-status-bar-max' : 'item-status-bar'}"
							type="button"
						>
							{tool.name}
						</button>
					{/if}
				{/each}
			</div>

			<div class="container-item-status-bar">
				<Battery battery={-1} class="place-self-center h-7 px-2 {$currentApplication?.size === 'max' ?'fill-white' : 'fill-gray-900 dark:fill-white'}" />
				<Wifi
					state={'no-connection'}
					class="place-self-center h-4 px-2 {$currentApplication?.size === 'max' ?'fill-white' : 'fill-gray-900 dark:fill-white'}"
				/>
				<ActionToggle
					class="place-self-center h-4 px-2 {$currentApplication?.size === 'max' ?'fill-white' : 'fill-gray-900 dark:fill-white'}"
					on:click={({ detail }) => {
						dispatcher('systemui', detail.clientX);
					}}
				/>
				<Siri />
				<StatusbarTime textColor={$currentApplication?.size === 'max' ? 'text-white' :'text-gray-900 dark:text-white'} />
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.container-status-bar {
		@apply fixed z-10 h-7 w-screen top-0 left-0 shadow-2xl blur-0;
	}

	.bg-status-bar {
		@apply backdrop-blur-md bg-white/30 w-screen h-full flex flex-row place-content-between select-none;
	}

	.bg-status-bar-max{
		@apply bg-gray-950 w-screen h-full flex flex-row place-content-between select-none;
	}

	.container-item-status-bar {
		@apply place-self-center h-full flex flex-row;
	}

	.item-status-bar {
		@apply mx-0.5 min-w-max h-full text-center text-sm font-sf-regular cursor-default focus:bg-gray-300 focus:bg-opacity-60 rounded-sm px-3 text-gray-900 dark:text-white;
	}
	.item-status-bar-max {
		@apply mx-0.5 min-w-max h-full text-center text-sm font-sf-regular cursor-default focus:bg-gray-300 focus:bg-opacity-60 rounded-sm px-3 text-white;
	}

	.active-application {
		@apply font-sf-bold text-xs px-2 rounded-sm focus:bg-gray-300 focus:bg-opacity-60 text-gray-900 dark:text-white;
	}

	.active-application-max {
		@apply font-sf-bold text-xs px-2 rounded-sm focus:bg-gray-300 focus:bg-opacity-60 text-white;
	}
</style>
