<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount } from 'svelte';
	import HeaderPanel from '../components/HeaderPanel.svelte';
	import ButtonPanelControl from '../components/ButtonPanelControl.svelte';

	let content: HTMLDivElement;

	let notes: Array<{ title: string, date: string, content: string }> = [
		{
			title: 'Absensi',
			date: '15/08/23',
			content: 'This is content'
		},
		{
			title: 'Dynamic size Jetpack Compose',
			date: '15/08/23',
			content: 'This is second content'
		}
	];

	let dispatcher = createEventDispatcher();
</script>

<HeaderPanel
	bg="#ffffff"
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
<div bind:this={content} class="h-full bg-white">
	<div class="flex flex-row justify-start">
		<div class="w-1/3 py-2">
			<p class="text-gray-900 px-2">Previous 30 days</p>
			<div class="bg-gray-400" style="height: 1px;" />
			{#each notes as note}
				<div class="flex flex-col justify-between px-4 py-2 mx-1 my-1 rounded-md hover:bg-yellow-600">
					<span class="text-gray-900 truncate">{note.title}</span>
					<span class="text-gray-900">{note.date}</span>
				</div>
			{/each}

		</div>
		<div class="w-full h-full p-2  font-primary">
			<p>sa</p>
		</div>
	</div>
</div>

<style>

</style>
