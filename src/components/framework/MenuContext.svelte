<script lang="ts">
	import { clickOutside } from '$lib/utils/clickoutside';
	import { fadeIn, fadeOut } from '$lib/utils/fade';
	import { createEventDispatcher } from 'svelte';
	import { host } from '$lib/core/framework/host';
	import { browser } from '$app/environment';

	let dispatcher = createEventDispatcher();
	let isShow: boolean = false;
	let positionX: number = 100;
	let positionY: number = 100;
	export let rounded: string = 'rounded-md';

	let element: HTMLDivElement;

	export function show(x: number, y: number) {
		isShow = true;
		positionX = x;
		positionY = y;
	}

	function normalize(posX: number, wEl: number, screenW: number): number {
		if (posX > screenW) {
			const diff = posX - screenW;
			return normalize(posX - diff, wEl, screenW);
		}
		if (posX == screenW) {
			return normalize(screenW - wEl, wEl, screenW);
		}
		return posX;
	}

	function measurePosition(x: number, y: number, el: HTMLDivElement) {
		//calculate left position
		if (!el) return;
		let screenW = host.getWidth();
		if(browser){
			screenW = document.documentElement.clientWidth
		}
		const elementW = el.clientWidth;
		const rightSideElement = x + elementW;
		if (rightSideElement >= screenW) {
			if (positionY < 28) {
				//menu context
				positionX = normalize(rightSideElement, elementW, screenW);
			} else {
				//statusbar
				const diff = rightSideElement - screenW;
				const final = positionX - (diff + 100);
				positionX = normalize(final, elementW, screenW);
			}
		}
	}

	export function hide() {
		isShow = false;
	}

	$: measurePosition(positionX, positionY, element);
</script>

{#if isShow}
	<div
		bind:this={element}
		class="fixed backdrop-blur-md shadow-2xl bg-white/30 dark:bg-gray-600 dark:bg-opacity-40 dark:backdrop-blur-md max-w-max py-1 px-1 select-none {rounded} my-1 mx-1 flex flex-col"
		style="z-index: 999;left: {positionX}px; top:{positionY}px;"
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
