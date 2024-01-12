<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let style: 'basic' | 'basic-sidebar' = 'basic';
	let appbar: HTMLDivElement;
	let header: HTMLDivElement;
	let cupertino: HTMLDivElement;
	let contextHeight: number = 0;
	let headerHeight: number = 50;
	let dispatcher = createEventDispatcher();
	onMount(() => {
		appbar.addEventListener('mousedown', () => {
			dispatcher('down', {});
		});
		if (header) {
			header.addEventListener('mousedown', () => {
				dispatcher('down', {});
			});

		}
		contextHeight = cupertino.clientHeight - headerHeight;
	});
</script>
<div bind:this={cupertino} class="w-full h-full relative">
	{#if style === 'basic'}
		<div bind:this={appbar} class="w-full select-none" style="height: {headerHeight}px;">
			<slot name="appbar" />
		</div>
		<div class="w-full h-max select-none" style="height: {contextHeight}px;">
			<slot />
		</div>
	{:else if style === 'basic-sidebar'}
		<div class="w-full h-full flex flex-row">
			<!--			sidebar 		-->
			<div class="w-1/4 flex flex-col text-sm font-sf-bold">
				<div bind:this={appbar} class="place-content-center select-none" style="height: {headerHeight}px">
					<slot name="appbar" />
				</div>
				<div class="overflow-y-hidden font-sf-bold text-gray-500 select-none" style="height: {contextHeight}px;">
					<slot name="sidebar">
						<p>sidebar</p>
					</slot>
				</div>
			</div>
			<!--			context		-->
			<div class="w-full flex flex-col">
				<div class="w-full text-sm font-sf-bold place-content-center select-none" bind:this={header} style="height: {headerHeight}px">
					<slot name="header">
						<p>header</p>
					</slot>
				</div>
				<div class="w-full select-none" style="height: {contextHeight}px;">
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