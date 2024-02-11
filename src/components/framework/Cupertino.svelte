<script lang="ts">
	import { onMount } from 'svelte';
	import { Host, host } from '$lib/core/framework/host';
	import type { Application } from '$lib/core/framework/framework';
	import TrafficLight from '../systemUI/TrafficLight.svelte';

	export let style: 'basic' | 'basic-sidebar' = 'basic';
	let appbar: HTMLDivElement | undefined;
	let header: HTMLDivElement | undefined;
	let cupertino: HTMLDivElement | undefined;
	let body: HTMLDivElement | undefined;
	let sidebar: HTMLDivElement | undefined;

	export let appWidth: number;
	export let appHeight: number;
	export let context: Application;

	let isFullScreen: boolean = false;
	let headerHeight: number = 50;
	let bodyHeight: number = 0;
	let sideBarWidth: number = 200;
	let idHeader = `id-header-${Math.random()}`;
	let idAppBar = `id-appbar-${Math.random()}`;

	function enableMove(event: MouseEvent) {
		if ((event.target as HTMLElement).id.startsWith('traffic-light')) return;
		windowActive();
		host.enableMove();
	}

	function windowActive() {
		Host.openApplication(context.getApplicationInfo().applicationId, context);
	}

	function measureBodyHeight(width: number, height: number) {
		if (height > headerHeight) {
			bodyHeight = height - headerHeight;
		}
	}

	function listenScreenChange(ctx: Application) {
		ctx.addOnFullScreenChangeListener('cupertino', (full) => {
			isFullScreen = full;
		});
	}

	$: measureBodyHeight(appWidth, appHeight);
	$: listenScreenChange(context);

	onMount(() => {
		appbar?.addEventListener('mousedown', enableMove);
		header?.addEventListener('mousedown', enableMove);
		body?.addEventListener('mousedown', windowActive);
		sidebar?.addEventListener('mousedown', windowActive);
		bodyHeight = cupertino?.clientHeight ?? 0 - headerHeight;
		return () => {
			appbar?.removeEventListener('mousedown', enableMove);
			header?.removeEventListener('mousedown', enableMove);
			body?.removeEventListener('mousedown', windowActive);
			sidebar?.removeEventListener('mousedown', windowActive);
		};
	});
</script>

<div
	bind:this={cupertino}
	id={context.getApplicationInfo().applicationId}
	class="w-full h-full relative"
>
	{#if style === 'basic'}
		<!--	appbar	-->
		<div
			id={idAppBar}
			bind:this={appbar}
			style="height: {headerHeight}px;"
			class="w-full select-none"
		>
			{#if !isFullScreen}
				<TrafficLight
					on:close={(e) => {
						context.closeApplication();
					}}
					on:minimize={(e) => {}}
					on:maximize={(e) => {
						if (host.getFullScreenMode()) {
							context.enterFullScreen();
						} else {
							context.enterFullScreen();
						}
					}}
				/>
			{/if}
		</div>
		<div bind:this={body} style="height: {bodyHeight}px;" class="w-full h-max select-none">
			<slot />
		</div>
	{:else if style === 'basic-sidebar'}
		<div class="w-full h-full flex flex-row">
			<!--			sidebar 		-->
			<div class="flex flex-col text-sm font-sf-bold" style="width: {sideBarWidth}px;">
				<div
					id={idAppBar}
					bind:this={appbar}
					style="height: {headerHeight}px;"
					class="place-content-center select-none"
				>
					{#if !isFullScreen}
						<TrafficLight
							on:close={(e) => {
								context.closeApplication();
							}}
							on:minimize={(e) => {}}
							on:maximize={(e) => {
								if (host.getFullScreenMode()) {
									context.enterFullScreen();
								} else {
									context.enterFullScreen();
								}
							}}
						/>
					{/if}
				</div>
				<div
					bind:this={sidebar}
					style="height: {bodyHeight}px;"
					class="overflow-y-hidden font-sf-bold text-gray-500 select-none"
				>
					<slot name="sidebar">
						<p>sidebar</p>
					</slot>
				</div>
			</div>
			<!--			context		-->
			<div class="w-full flex flex-col">
				<div
					id={idHeader}
					bind:this={header}
					style="height: {headerHeight}px;"
					class="w-full text-sm font-sf-bold place-content-center select-none"
				>
					<slot name="header">
						<p>header</p>
					</slot>
				</div>
				<div bind:this={body} style="height: {bodyHeight}px;" class="w-full select-none">
					<slot>
						<p>content</p>
					</slot>
				</div>
			</div>
		</div>
	{:else}
		<div>No style provide</div>
	{/if}
</div>

<style>
	/* width */
	::-webkit-scrollbar {
		width: 6px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: rgba(241, 241, 241, 0);
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #3f3f3f;
		border-radius: 5px;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
