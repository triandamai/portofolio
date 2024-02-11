<script lang="ts">
	import { clickOutside } from '$lib/utils/clickoutside';
	import { fadeIn, fadeOut } from '$lib/utils/fade';
	import { createEventDispatcher } from 'svelte';

	let dispatcher = createEventDispatcher();
	let isShow: boolean = false;
	let positionX: number = 0;
	let positionY: number = 30;
	let width: number = 500;
	export let rounded: string = 'rounded-md';

	let element: HTMLDivElement;

	export function show(x: number) {
		isShow = true;
		positionX = x - (width/3);
	}

	export function hide() {
		isShow = false;
	}
</script>

{#if isShow}
	<div
		bind:this={element}
		class="fixed backdrop-blur-md shadow-2xl bg-white/30 dark:bg-gray-600 dark:bg-opacity-40 dark:backdrop-blur-md max-w-max py-1 px-1 select-none {rounded} my-1 mx-1 flex flex-col"
		style="z-index: 999; width:{width}px; left: {positionX}px; top:{positionY}px;"
		in:fadeIn
		out:fadeOut
		use:clickOutside={{
			callback: () => {
				dispatcher('clickOutside', () => {
					hide();
				});
				return true;
			}
		}}
	>
		<slot>Default context</slot>
	</div>
{/if}
