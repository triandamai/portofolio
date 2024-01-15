<script lang="ts">
	import MenuContext from '../../framework/MenuContext.svelte';
	import MenuContextItem from '../../framework/MenuContextItem.svelte';
	import type { OsKernel } from '$lib/manifest/application.manifest';

	export let kernel: OsKernel;

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
	kernel={kernel}
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