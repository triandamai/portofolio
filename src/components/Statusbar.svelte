<script lang="ts">
	import logo_apple from '$lib/image/apple_logo.png';
	import icon_siri from "$lib/image/icon_siri.png"
	import StatusbarMenuItem from './StatusbarContextMenu.svelte';
	let statusBarContextMenu: StatusbarMenuItem | undefined;

	const statusbarMenuItems: Array<{ name: string; icon: string; type: 'icon' | 'text' }> = [
		{
			name: 'Logo',
			icon: logo_apple,
			type: 'icon'
		},
		{
			name: 'File',
			icon: logo_apple,
			type: 'text'
		},
		{
			name: 'Edit',
			icon: logo_apple,
			type: 'text'
		},
		{
			name: 'Selection',
			icon: logo_apple,
			type: 'text'
		},
		{
			name: 'View',
			icon: logo_apple,
			type: 'text'
		},
		{
			name: 'Go',
			icon: logo_apple,
			type: 'text'
		},
		{
			name: 'Run',
			icon: logo_apple,
			type: 'text'
		},
		{
			name: 'Terminal',
			icon: logo_apple,
			type: 'text'
		}
	];

	function handleStatusBarClick(event: MouseEvent | PointerEvent) {
		statusBarContextMenu?.toggle(event.clientX, 20);
	}
</script>
<div class="z-10 fixed top-0 w-screen flex flex-row justify-start backdrop-blur-sm bg-white/10">
	<div class="w-screen flex flex-row justify-between">
		<div class="flex flex-row py-1">
			{#each statusbarMenuItems as bar}
				<div on:click={handleStatusBarClick}>
					{#if bar.type === 'icon'}
						<img class="status" src={bar.icon} alt="" />
					{:else if bar.type === 'text'}
						<p class=" status text-white text-center text-xs cursor-default">
							{bar.name}
						</p>
					{/if}
				</div>
			{/each}
		</div>
		<div class="flex flex-row py-1">
			<img class="status" src={icon_siri} alt="" />
			<p class=" status text-white text-center text-xs cursor-default">Wed 13 Sep 14.02</p>
		</div>
	</div>
	<StatusbarMenuItem bind:this={statusBarContextMenu} />
</div>

<style>
	.status {
		@apply min-w-max h-4 mx-2;
	}
</style>
