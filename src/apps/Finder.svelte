<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount } from 'svelte';
	import HeaderPanel from '../components/HeaderPanel.svelte';
	import ButtonPanelControl from '../components/ButtonPanelControl.svelte';

	let width: number = 500;
	let content: HTMLDivElement;
	let dispatcher = createEventDispatcher();

</script>
<HeaderPanel
	bg="#FFFFFF"
	on:down={({detail})=>{
		dispatcher('down', detail);
	}}
>
	<ButtonPanelControl
		on:close={()=>{
			dispatcher('close', {});
		}}
		on:maximize={()=>{
			dispatcher('maximize', {});
		}}
		on:minimize={()=>{
			dispatcher('minimize', {});
		}}
	/>
</HeaderPanel>
<div class="w-full bg-gray-600" style="height: 1px;"/>
<div bind:this={content} class="h-full w-full">
	<div class="w-full h-full flex flex-row justify-start">
		<div class="w-1/3 rounded-bl-md py-2 px-2 bg-content" bind:clientWidth={width}>
			<p>Favorites</p>
			<p>Airdrop</p>
		</div>
		<div class="w-full rounded-br-md bg-content p-2">
			<p>sa</p>
		</div>
	</div>
</div>

<style lang="scss">
    .bg-content {
        background-color: rgb(255, 255, 255);
    }
</style>