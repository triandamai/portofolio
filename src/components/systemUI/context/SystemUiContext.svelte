<script lang="ts">
	import AppleLogo from '../../SVG/system/logo/AppleLogo.svelte';
	import MenuContext from '../../framework/MenuContext.svelte';
	import type { OsKernel } from '$lib/manifest/application.manifest';

	export let kernel:OsKernel

	let menuContext: MenuContext;

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
	<div class="p-2 rounded-lg flex flex-col">
		<div class="w-full flex flex-row place-content-center mb-1">
			<!--			left		-->
			<div class="backdrop-blur-md bg-white/30 flex flex-col mr-1 rounded-xl">
				<div class="px-2 py-2 flex flex-row">
					<div class="rounded-full h-min bg-gray-400 flex flex-row place-content-center">
						<AppleLogo class="h-3 w-3 m-2" />
					</div>
					<div class="ml-2 place-self-center flex flex-col">
						<span class="text-sm font-sf-semibold">Wi-Fi</span>
						<span class="font-sf-light text-xs">GLADYS-5</span>
					</div>
				</div>
				<div class="px-2 py-2 flex flex-row">
					<div class="rounded-full h-min bg-gray-400 flex flex-row place-content-center">
						<AppleLogo class="h-3 w-3 m-2" />
					</div>
					<div class="ml-2 place-self-center flex flex-col">
						<span class="text-sm font-sf-semibold">Bluetooth</span>
						<span class="font-sf-light text-xs">On</span>
					</div>
				</div>
				<div class="px-2 py-2 flex flex-row">
					<div class="rounded-full h-min bg-gray-400 flex flex-row place-content-center">
						<AppleLogo class="h-3 w-3 m-2" />
					</div>
					<div class="ml-2 place-self-center flex flex-col">
						<span class="text-sm font-sf-semibold">Airdrop</span>
						<span class="font-sf-light text-xs">Everyone</span>
					</div>
				</div>
			</div>
			<!--			right			-->
			<div class="flex flex-col ml-1">
				<div class="backdrop-blur-md bg-white/30 mb-1 flex flex-row px-2 py-5 rounded-xl">
					<div class="rounded-full h-min w-min bg-gray-400 flex flex-row place-content-center">
						<AppleLogo class="h-3 w-3 m-2" />
					</div>
					<span class="ml-2 place-self-center text-xs font-sf-light">Theme Light</span>
				</div>
				<div class="flex flex-row mt-1">
					<div class="backdrop-blur-md bg-white/30 max-w-[5rem] rounded-xl mr-1">
						<div class="flex flex-col py-2">
							<div class="rounded-full w-min h-min bg-gray-400 flex flex-row place-self-center">
								<AppleLogo class="h-3 w-3 m-2" />
							</div>
							<span class="p-1 place-self-center text-wrap text-center text-xs font-sf-light">Stage Manager</span>
						</div>
					</div>
					<div class="backdrop-blur-md bg-white/30 max-w-[5rem] rounded-xl ml-1">
						<div class="flex flex-col py-2">
							<div class="rounded-full h-min bg-gray-400 justify-center w-min flex flex-row place-self-center">
								<AppleLogo class="h-3 w-3 m-2" />
							</div>
							<span class="p-1 place-self-center text-wrap text-center text-xs font-sf-light">Screen Mirroring</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="w-full backdrop-blur-md bg-white/30 rounded-xl flex flex-row px-2 py-2 mt-1">
			<div class="w-10 h-10 bg-gray-400">

			</div>
			<div class="ml-2 place-self-center flex flex-col">
				<span class="text-sm font-sf-semibold">Walpaper</span>
				<span class="font-sf-light text-xs">Big sur</span>
			</div>
		</div>
	</div>
</MenuContext>