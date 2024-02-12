<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { OptionsMenu, Toolbar } from '$lib/core/type';
	import { sineInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	import StatusbarTime from './StatusbarTime.svelte';
	import Siri from '../../SVG/system/siri/Siri.svelte';
	import Wifi from '../../SVG/system/wifi/Wifi.svelte';
	import Battery from '../../SVG/system/battery/Battery.svelte';
	import ActionToggle from '../../SVG/system/action/ActionToggle.svelte';
	import AppleLogo from '../../SVG/system/logo/AppleLogo.svelte';
	import { Host, host } from '$lib/core/framework/host';
	import type { Application } from '$lib/core/framework/application';
	import TrafficLight from '../TrafficLight.svelte';

	const dispatcher = createEventDispatcher();
	let statusbar: HTMLDivElement;
	let isShow: boolean = true;
	let toolbar: Array<Toolbar> = [];
	let isFullScreen: boolean = false;
	let activeApplication: Application | null;

	export function getStatusbarInfo(): { x: number; y: number; height: number; isShow: boolean } {
		if (statusbar) {
			return {
				x: statusbar.clientLeft,
				y: statusbar.clientTop,
				height: statusbar.clientHeight,
				isShow: isShow
			};
		}
		return { x: 0, y: 0, height: 0, isShow: isShow };
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
			contextMenu: []
		});
	}


	onMount(() => {
		activeApplication = Host.appManager().getActiveApplication();
		isFullScreen = Host.appManager().getIsFullscreenMode();
		Host.appManager().addOnActiveApplicationChangeListener('statusbar', (app) => {
			activeApplication = app;
		});
		Host.appManager().addOnFullscreenModeChangeListener('statusbar', (fullscreen) => {
			isFullScreen = fullscreen;
		});
		Host.statusbarManager().addOnStatusbarVisibilityChangedListener('statusbar',(show)=>{
			isShow = show
		})

		return () => {
			Host.appManager().removeOnActiveApplicationChangeListener('statusbar');
			Host.appManager().removeFullscreenModeChangeListener('statusbar');
			Host.statusbarManager().removeStatusbarVisibilityChangedListener("statusbar")
		};
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
		<div class={activeApplication?.screen === 'full' ? 'bg-status-bar-max' : 'bg-status-bar'}>
			<div class="container-item-status-bar">
				<AppleLogo
					on:click={showSystemContextMenu}
					class="h-5 mx-2 place-self-center {isFullScreen
						? 'fill-white'
						: 'fill-gray-900 dark:fill-white'}"
				/>
				<button
					on:click={(e) => {
						showContextMenu(e, activeApplication?.getMenubar());
					}}
					class={isFullScreen
						? 'active-application-max'
						: 'active-application '}
					type="button"
				>
					{activeApplication?.getApplicationInfo()?.applicationName ?? ''}
				</button>

				{#each toolbar as tool}
					<button
						on:click={(e) => showContextMenu(e, tool.contextMenu)}
						class={isFullScreen ? 'item-status-bar-max' : 'item-status-bar'}
						type="button"
					>
						{tool.name}
					</button>
				{/each}
			</div>

			<div class="container-item-status-bar">
				<Battery
					battery={-1}
					class="place-self-center h-7 px-2 {isFullScreen
						? 'fill-white'
						: 'fill-gray-900 dark:fill-white'}"
				/>
				<Wifi
					state={'no-connection'}
					class="place-self-center h-4 px-2 {isFullScreen
						? 'fill-white'
						: 'fill-gray-900 dark:fill-white'}"
				/>
				<ActionToggle
					class="place-self-center h-4 px-2 {isFullScreen
						? 'fill-white'
						: 'fill-gray-900 dark:fill-white'}"
					on:click={({ detail }) => {
						dispatcher('systemui', detail);
					}}
				/>
				<Siri />
				<StatusbarTime
					textColor={isFullScreen
						? 'text-white'
						: 'text-gray-900 dark:text-white'}
				/>
			</div>
		</div>
		{#if isFullScreen}
			<div class="bg-gray-400 w-screen h-full">
				<TrafficLight
					on:red={() => {
						Host.appManager().getActiveApplication()?.onRedClicked()
					}}
					on:yellow={() => {
						Host.appManager().getActiveApplication()?.onYellowClicked()
					}}
					on:green={() => {
						Host.appManager().getActiveApplication()?.onGreenClicked()
					}}
				/>
			</div>
		{/if}
	</div>
{/if}

<style lang="postcss">
    .container-status-bar {
        @apply fixed z-10 h-7 w-screen top-0 left-0 shadow-2xl blur-0 flex flex-col;
    }

    .bg-status-bar {
        @apply backdrop-blur-md bg-white/30 w-screen h-full flex flex-row place-content-between select-none;
    }

    .bg-status-bar-max {
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
