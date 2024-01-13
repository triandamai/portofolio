<script lang="ts">
	import { fadeIn, fadeOut } from '$lib/utils/fade';
	import { clickOutside } from '$lib/utils/clickoutside';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatcher = createEventDispatcher();
	let isShow: boolean = false;
	let screen: HTMLDivElement | undefined;

	export function show() {
		if (!isShow) {
			isShow = true;
		}
	}

	export function hide() {
		isShow = false;
	}

</script>
{#if isShow}
	<div
		bind:this={screen}
		on:mousedown={()=>{
			dispatcher('clickOutside', () => {
					hide();
				});
		}}
		class="main-layout">
		<div
			in:fadeIn
			out:fadeOut
			class="h-screen w-screen backdrop-blur-[100px] bg-white/10"
		>

		</div>
	</div>
{/if}
<style>
    .main-layout {
        position: fixed;
        background-image: url($lib/walpaper/big-sur-7.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        background-color: #949494;
        z-index: 10;
    }
</style>