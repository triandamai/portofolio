<script lang="ts">
	import type { Application } from '$lib/core/framework/framework';
	import { fadeIn, fadeOut } from '$lib/utils/fade';
	import { tweened } from 'svelte/motion';
	import { sineInOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	export let context: Application;

	const width = tweened(0, {
		duration: 200,
		easing: sineInOut
	});
	const height = tweened(0, {
		duration: 200,
		easing: sineInOut
	});

	let positionX: number = 0;
	let positionY: number = 28;
	let zIndex: number = 0;

	let isShow: boolean = false;
	let container: HTMLDivElement;

	function onSizeChange(w: number, h: number, x: number, y: number) {
		positionX = x;
		positionY = y;
		width.set(w);
		height.set(h);
	}

	function initApp(app: Application) {
		app.addOnShowListener('desktop', show);
		app.addOnHideListener('desktop', hide);
		app.addOnSizeChangedListener('desktop', onSizeChange);
		app.addOnZIndexChangeListener(() => {
			zIndex = app.getZIndex();
		});
		app.addOnMoveListener('desktop', (x, y) => {
			if (container) {
				positionX = x;
				positionY = y;
			}
		});
		app.addOnHideListener;
	}

	function show() {
		isShow = true;
		width.set(context.width);
		height.set(context.height);
		positionX = context.x;
		positionY = context.y;
	}

	function hide() {
		isShow = false;
	}

	$: initApp(context);

	onMount(() => {
		return () => {
			context.removeOnMoveListener('desktop');
		};
	});
</script>

{#if isShow}
	<div
		id={context.appID}
		bind:this={container}
		in:fadeIn
		out:fadeOut
		class="backdrop-blur-[500px] bg-white/40 dark:bg-gray-900 dark:bg-opacity-40 absolute shadow-2xl rounded-md"
		style="width: {$width}px;height:{$height}px; left:{positionX}px; top:{positionY}px; z-index:{zIndex};"
	>
		<slot width={$width} height={$height} />
	</div>
{/if}
