<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let style: 'basic' | 'basic-sidebar' = 'basic';
	let appbar: HTMLDivElement | undefined;
	let header: HTMLDivElement | undefined;
	let cupertino: HTMLDivElement | undefined;
	let body: HTMLDivElement | undefined;
	let headerHeight: number = 50;
	let bodyHeight: number = 0;
	let dispatcher = createEventDispatcher();
	onMount(() => {
		appbar?.addEventListener('mousedown', () => {
			dispatcher('down', {});
		});
		header?.addEventListener('mousedown', () => {
			dispatcher('down', {});
		});
		bodyHeight = (cupertino.clientHeight - headerHeight);
	});
</script>
<div bind:this={cupertino} class="w-full h-full relative">
	{#if style === 'basic'}
		<!--	appbar	-->
		<div bind:this={appbar} style="height: {headerHeight}px;" class="w-full select-none">
			<slot name="appbar" />
		</div>
		<div bind:this={body} style="height: {bodyHeight}px;" class="w-full h-max select-none">
			<slot />
		</div>
	{:else if style === 'basic-sidebar'}
		<div class="w-full h-full flex flex-row">
			<!--			sidebar 		-->
			<div class="w-1/4 flex flex-col text-sm font-sf-bold">
				<div bind:this={appbar} style="height: {headerHeight}px;" class="place-content-center select-none">
					<slot name="appbar" />
				</div>
				<div style="height: {bodyHeight}px;" class="overflow-y-hidden font-sf-bold text-gray-500 select-none">
					<slot name="sidebar">
						<p>sidebar</p>
					</slot>
				</div>
			</div>
			<!--			context		-->
			<div class="w-full flex flex-col">
				<div bind:this={header} style="height: {headerHeight}px;"
						 class="w-full text-sm font-sf-bold place-content-center select-none">
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
	{:else }
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