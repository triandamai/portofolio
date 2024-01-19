<script lang="ts">
	import type { OsKernel } from '$lib/core/type';

	import MenuContext from '../../framework/MenuContext.svelte';
	import MenuContextItem from '../../framework/MenuContextItem.svelte';


	export let macos: OsKernel;

	let contextMenu: MenuContext;
</script>

<svelte:window
	on:contextmenu|preventDefault={(e)=>{
		contextMenu.show(e.offsetX,e.offsetY)
	}}
	on:click={()=>{
		contextMenu.hide()
	}}
/>
<MenuContext
	bind:this={contextMenu}
	macos={macos}
	on:clickOutside={({detail})=>{
		detail()
	}}
>
	<MenuContextItem
		type="button"
		name="New Folder"
		on:itemClick={()=>{
				contextMenu.hide()
		}}
	/>
	<MenuContextItem
		type="divider"
	/>
	<MenuContextItem
		type="button"
		name="Get Info"
		on:itemClick={({detail})=>{
				contextMenu.hide()
		}}
	/>
	<MenuContextItem
		type="button"
		name="Change Wallpaper"
		on:itemClick={({detail})=>{
				contextMenu.hide()
		}}
	/>
	<MenuContextItem
		type="button"
		name="Edit Widgets..."
		on:itemClick={({detail})=>{
				contextMenu.hide()
		}}
	/>
</MenuContext>