<script lang="ts">
	import type { OptionsMenu,OsKernel} from '$lib/core/type';
	import {openApplication} from '$lib/core/system/macos';
	import { goto } from '$app/navigation';
	import { currentApplication, notifySelectedStatusBar } from '$lib/core/application';
	
	import MenuContext from '../../framework/MenuContext.svelte';
	import MenuContextItem from '../../framework/MenuContextItem.svelte';

	export let menuContextData:Array<OptionsMenu> = []
	export let macos:OsKernel

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
	macos={macos}
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
					}else if(context.name === 'About This Mac'){
						const findAboutApp = macos.applications.find(e=>e.appID === "about")
						if(findAboutApp){
							openApplication(findAboutApp)
						}
					}else {
						notifySelectedStatusBar($currentApplication?.context.appID ?? '',context)
					}
			}}
		/>
	{/each}
</MenuContext>