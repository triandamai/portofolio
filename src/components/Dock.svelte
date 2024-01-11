<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import icon_finder from '$lib/image/icon_finder.png';
	import icon_launchpad from '$lib/image/icon_launchpad.png';
	import icon_trash from '../lib/image/icon_trash.png';
	import dock_note from "../lib/image/dock_note.png"
	import { tooltip } from '$lib/tooltip';
	const dispatcher = createEventDispatcher();

	const icons: Array<{ name: string; icon: string }> = [
		{
			name: 'Finder',
			icon: icon_finder
		},
		{
			name: 'Launcher',
			icon: icon_launchpad
		},
		{
			name: 'Trash',
			icon: icon_trash
		},
		{
			name: 'Notes',
			icon: dock_note
		}
	];
</script>

<div class="z-999 w-screen flex flex-row justify-center">
	<div
		class="fixed bottom-0 flex flex-row backdrop-blur-sm bg-white/30 rounded-md py-1 px-2 cursor-default"
	>
		{#each icons as icon}
			<div
				use:tooltip={icon.name}
				on:click={() => {
					dispatcher('menu', icon.name);
				}}
				class="item-dock hover:scale-125"
			>
				<img class="" src={icon.icon} alt="" />
			</div>
		{/each}
	</div>
</div>

<style>
	.item-dock {
		@apply w-8 h-8 mx-1 cursor-default rounded-lg transform transition duration-500;
	}
</style>
