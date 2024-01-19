<script lang="ts">
	import { interpolate } from 'popmotion';
	import { spring, tweened } from 'svelte/motion';
	import { tooltip } from '$lib/utils/tooltip';
	import ButtonBase from './ButtonBase.svelte';
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount } from 'svelte';
	import { sineInOut } from 'svelte/easing';

	/** Block 1 */

	export let appID: string;
	export let mouseX: number | null;
	export let active: boolean = true;

	let el: HTMLImageElement;
	const dispatcher = createEventDispatcher();

	/** Block 2 */

	const baseWidth = 57.6;
	const distanceLimit = baseWidth * 6;
	const beyondTheDistanceLimit = distanceLimit + 1;
	const distanceInput = [
		-distanceLimit,
		-distanceLimit / 1.25,
		-distanceLimit / 2,
		0,
		distanceLimit / 2,
		distanceLimit / 1.25,
		distanceLimit
	];
	const widthOutput = [
		baseWidth,
		baseWidth * 0.7,
		baseWidth * 0.8,
		baseWidth * 1.1,
		baseWidth * 0.8,
		baseWidth * 0.7,
		baseWidth
	];

	let distance = beyondTheDistanceLimit;

	const widthPX = spring(baseWidth, {
		damping: 0.38,
		stiffness: 0.1
	});

	$: $widthPX = interpolate(distanceInput, widthOutput)(distance);

	let width: string;
	$: width = `${$widthPX / 18}rem`;

	/** Block 3 */

	let raf: number;

	function animate(mouseX: number) {
		if (el && mouseX !== null) {
			const rect = el.getBoundingClientRect();

			// get the x coordinate of the img DOMElement's center
			// the left x coordinate plus the half of the width
			const imgCenterX = rect.left + rect.width / 2;

			// difference between the x coordinate value of the mouse pointer
			// and the img center x coordinate value
			const distanceDelta = mouseX - imgCenterX;
			distance = distanceDelta;
			return;
		}

		distance = beyondTheDistanceLimit;
	}

	const bounceItem = tweened(0, {
		duration: 400,
		easing: sineInOut
	});

	function req(mouseX: number | null) {
		if (browser) {
			raf = requestAnimationFrame(() => animate(mouseX ?? 0));
		}
	}

	async function bounceEffect() {
		dispatcher('click');
		if (appID === 'launchpad') return;
		// Animate the icon
		await bounceItem.set(-30);
		await bounceItem.set(0);
	}

	$: req(mouseX);

</script>

<section>
	<ButtonBase
		on:click={()=>{
			bounceEffect()
		}}
		class="flex flex-col place-self-center">
		<span style="transform: translate(0,{$bounceItem}px)">
		<img
			use:tooltip={appID}
			bind:this={el}
			class="app-icon mb-0.5"
			src="/app-icons/{appID}/256.png"
			alt=""
			style="width: {width};"
			draggable="false"
		/>
			</span>
		{#if active}
			<span class="absolute bottom-0 w-1 h-1 bg-gray-900 rounded-full" />
		{/if}
	</ButtonBase>
</section>

<style lang="postcss">

  .app-icon {
    width: 40.6px;
    height: auto;
  }
</style>