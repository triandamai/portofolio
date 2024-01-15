<script lang="ts">
	import { type OptionsMenu, Os } from '$lib/manifest/application.manifest';
	import { goto } from '$app/navigation';
	import MenuContext from '../../framework/MenuContext.svelte';
	import MenuContextItem from '../../framework/MenuContextItem.svelte';

	const {broadcastEvent} = Os()
	export let menuContextData:Array<OptionsMenu> = []
	let menuContext:MenuContext
	export function show(x:number,y:number,data:Array<OptionsMenu>){
		menuContext.show(x,y)
		menuContextData = data
	}
	export function hide(){
		menuContext.hide()
	}
</script>
<MenuContext
	bind:this={menuContext}
	on:clickOutside={({detail})=>{detail()}}
>
	{#each menuContextData as context }
		<MenuContextItem
			type={context.type}
			name={context.name}
			on:itemClick={()=>{
					menuContext.hide()
					if(context.name === 'LockScreen' || context.name === 'Log Out'){
						goto("/lock")
					}else {
						broadcastEvent("ini data")
					}
			}}
		/>
	{/each}
</MenuContext>