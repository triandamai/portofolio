<script lang="ts">
	import AppleLogo from '../../SVG/system/logo/AppleLogo.svelte';
	import MenuContext from '../../framework/MenuContext.svelte';
	import { Os } from '$lib/kernel/kernel';
	import type { OsKernel } from '$lib/kernel/type';

	let menuContext: MenuContext;
	export let kernel:OsKernel

	const {changeTheme} = Os()

	function updateTheme(){
		changeTheme()
	}


	export function show(x:number,y:number){
		menuContext.show(x,y)
	}

	export function hide(){
		menuContext.hide()
	}

</script>
<MenuContext
	bind:this={menuContext}
	kernel={kernel}
	rounded="rounded-2xl"
	on:clickOutside={({detail})=>{
		detail()
	}}
>
	<div class="p-2 rounded-2xl flex flex-col">
		<div class="w-full flex flex-row place-content-center mb-1">
			<!--			left		-->
			<div class="container flex flex-col">
				<div class="px-2 py-2 flex flex-row">
					<div class="rounded-full h-min bg-gray-400 flex flex-row place-content-center">
						<AppleLogo class="h-3 w-3 m-2 dark:fill-white" />
					</div>
					<div class="ml-2 place-self-center flex flex-col">
						<span class="text-sm font-sf-semibold dark:text-white">Wi-Fi</span>
						<span class="font-sf-light text-xs dark:text-gray-400">GLADYS-5</span>
					</div>
				</div>
				<div class="px-2 py-2 flex flex-row">
					<div class="rounded-full h-min bg-gray-400 flex flex-row place-content-center">
						<AppleLogo class="h-3 w-3 m-2 dark:fill-white" />
					</div>
					<div class="ml-2 place-self-center flex flex-col">
						<span class="text-sm font-sf-semibold dark:text-white">Bluetooth</span>
						<span class="font-sf-light text-xs dark:text-gray-400">On</span>
					</div>
				</div>
				<div class="px-2 py-2 flex flex-row">
					<div class="rounded-full h-min bg-gray-400 flex flex-row place-content-center">
						<AppleLogo class="h-3 w-3 m-2 dark:fill-white" />
					</div>
					<div class="ml-2 place-self-center flex flex-col">
						<span class="text-sm font-sf-semibold dark:text-white">Airdrop</span>
						<span class="font-sf-light text-xs dark:text-gray-400">Everyone</span>
					</div>
				</div>
			</div>
			<!--			right			-->
			<div class="flex flex-col">
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="container flex flex-row py-4 px-2"
					on:mousedown={()=>{
						updateTheme()
					}}
				>
					<div class="rounded-full h-min w-min bg-gray-400 dark:bg-blue-500 flex flex-row place-content-center">
						<AppleLogo class="h-3 w-3 m-2 fill-gray-900 dark:fill-white" />
					</div>
					<span class="ml-2 place-self-center text-xs font-sf-light dark:text-white">Theme Light</span>
				</div>
				<div class="flex flex-row w-full place-content-between">
					<div class="container w-1/2">
						<div class="flex flex-col py-2 px-1">
							<div class="rounded-full w-min h-min bg-gray-400 flex flex-row place-self-center">
								<AppleLogo class="h-3 w-3 m-2 dark:fill-white" />
							</div>
							<span class="p-1 place-self-center text-wrap text-center text-xs font-sf-light dark:text-white">Stage Manager</span>
						</div>
					</div>
					<div class="container w-1/2">
						<div class="flex flex-col py-2 px-1">
							<div class="rounded-full h-min bg-gray-400 justify-center w-min flex flex-row place-self-center">
								<AppleLogo class="h-3 w-3 m-2 dark:fill-white" />
							</div>
							<span class="p-1 place-self-center text-wrap text-center text-xs font-sf-light dark:text-white">Screen Mirroring</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="container flex flex-row px-2 py-2">
			<div class="w-10 h-10 bg-gray-400">

			</div>
			<div class="ml-2 place-self-center flex flex-col">
				<span class="text-sm font-sf-semibold dark:text-white">Walpaper</span>
				<span class="font-sf-light text-xs dark:text-gray-400">Big sur</span>
			</div>
		</div>
	</div>
</MenuContext>
<style lang="postcss">
	.container{
			@apply  backdrop-blur-[100px] bg-white/30 dark:bg-gray-600 dark:bg-opacity-40 dark:border-gray-700 shadow-md m-0.5 rounded-xl;
	}
</style>