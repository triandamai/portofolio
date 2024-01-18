<script lang="ts">
	import type { OptionsMenu,OsKernel} from '$lib/kernel/type';
	import { goto } from '$app/navigation';
	import MenuContext from '../../framework/MenuContext.svelte';
	import MenuContextItem from '../../framework/MenuContextItem.svelte';
	import { currentApplication, notifySelectedStatusBar } from '$lib/kernel/application/application';

	export let menuContextData:Array<OptionsMenu> = []
	export let kernel:OsKernel
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
	kernel={kernel}
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
						notifySelectedStatusBar($currentApplication?.context.appID ?? '',context)
					}
			}}
		/>
	{/each}
</MenuContext>