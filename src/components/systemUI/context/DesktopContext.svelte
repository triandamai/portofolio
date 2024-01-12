<script lang="ts">
	import MenuContext from '../../framework/MenuContext.svelte';
	import MenuContextItem from '../../framework/MenuContextItem.svelte';

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
	on:clickOutside={({detail})=>{
		detail()
	}}
>
	<MenuContextItem
		type="button"
		name="New Folder"
		on:itemClick={({detail})=>{
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