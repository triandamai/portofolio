<script lang="ts">
	import { clickOutside } from '$lib/utils/clickoutside';
	import { fadeIn, fadeOut } from '$lib/utils/fade';

	let isShow: boolean = false;
	let positionX: number = 100;
	let positionY: number = 100;

	export function show(x: number, y: number) {
		positionX = x;
		positionY = y;
		isShow = true;
	}

	export function hide() {
		isShow = false;
	}
</script>
{#if isShow}
<div
	class="fixed backdrop-blur-3xl shadow-md bg-white/30 max-w-max py-1 px-1 select-none rounded-md my-1 mx-1 flex flex-col"
	style="z-index: 999;left: {positionX}px; top:{positionY}px;"
	in:fadeIn
	out:fadeOut
	use:clickOutside={{callback:()=>{
		hide()
		return true
	}}}
>
	<slot>Default context</slot>
</div>
	{/if}