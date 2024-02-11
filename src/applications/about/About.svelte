<script lang="ts">
	import type { Application } from '$lib/core/type';
	import Cupertino from '../../components/framework/Cupertino.svelte';
	import TrafficLight from '../../components/systemUI/TrafficLight.svelte';

	export let width: number;
	export let height: number;
	export let context: Application;
</script>

<Cupertino appWidth={width} appHeight={height} {context} on:enableMove on:windowActive>
	<TrafficLight
		slot="appbar"
		on:close={(e) => {}}
		on:minimize={(e) => {}}
		on:maximize={(e) => {}}
	/>
	<div class="flex flex-col">
		<div class="w-full flex flex-row place-content-center mb-2">
			<!-- mac image -->
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<!-- svelte-ignore a11y-missing-attribute -->
			<img src="/mac.png" style="width: 90px; height:60px;" />
		</div>
		<div class="w-full flex flex-col">
			<span class="text-gray-50 place-self-center font-sf-bold text-2xl"> MacBook Pro </span>
			<span class="text-gray-300 place-self-center font-sf-light text-sm"> 13-inch, M1, 2020 </span>
		</div>
		<div class="mt-3 mb-3 w-full flex flex-col">
			<div class="w-full flex flex-row place-content-center">
				<span class="system-info-left"> Chip </span>
				<span class="system-info-right"> Apple M1 </span>
			</div>
			<div class="w-full flex flex-row place-content-center">
				<span class="system-info-left"> Memory </span>
				<span class="system-info-right"> 8 GB </span>
			</div>
			<div class="w-full flex flex-row place-content-center">
				<span class="system-info-left"> Serial number </span>
				<span class="system-info-right"> XXXXXXXXXXXX </span>
			</div>
			<div class="w-full flex flex-row place-content-center">
				<span class="system-info-left"> macOS </span>
				<span class="system-info-right"> Sonoma 14.2.1 </span>
			</div>
		</div>
		<button class="bg-gray-800 bg-opacity-40 w-1/3 place-self-center rounded-lg text-white text-sm font-sf-medium py-0.5"> More Info... </button>
		<div class="flex flex-row place-content-center mt-2">
			<!-- svelte-ignore a11y-invalid-attribute -->
			<span class="text-gray-300 font-sf-light text-sm">Made with
				<span class="text-red-500">❤️</span> by
				<a class="text-xs" target="_blank" href="#">Trian Damai</a>
			</span>
		</div>
	</div>
</Cupertino>

<style lang="postcss">
	.system-info-left {
		@apply w-1/2 text-right text-white mr-1 font-sf-regular;
	}
	.system-info-right {
		@apply w-1/2 text-left text-gray-300 ml-1 font-sf-light text-sm place-self-center;
	}
</style>
