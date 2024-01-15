<script lang="ts">
	import type { Application, OptionsMenu, OsKernel } from '$lib/manifest/application.manifest';
	import { createEventDispatcher } from 'svelte';
	import { fadeIn, fadeOut } from '$lib/utils/fade';

	import StatusbarTime from './StatusbarTime.svelte';
	import Siri from '../../SVG/system/siri/Siri.svelte';
	import Wifi from '../../SVG/system/wifi/Wifi.svelte';
	import Battery from '../../SVG/system/battery/Battery.svelte';
	import ActionToggle from '../../SVG/system/action/ActionToggle.svelte';
	import AppleLogo from '../../SVG/system/logo/AppleLogo.svelte';

	const dispatcher = createEventDispatcher();
	let statusbar: HTMLDivElement;
	let isShow: boolean = true;

	export let kernel: OsKernel;
	export let applicationContext: Application | null;

	export function show() {
		if (!isShow) {
			isShow = true;
		}
	}

	export function hide() {
		isShow = false;
	}

	export function getStatusbarInfo(): { x: number, y: number, height: number } {
		if (statusbar) {
			return {
				x: statusbar.clientLeft,
				y: statusbar.clientTop,
				height: statusbar.clientHeight
			};
		}
		return { x: 0, y: 0, height: 0 };
	}

	function showContextMenu(
		opt: Array<OptionsMenu> = [],
		x: number = 0
	) {
		dispatcher('showMenuContext', {
			x: x,
			y: (statusbar.offsetTop + statusbar.clientHeight),
			contextMenu: opt
		});
	}
</script>
{#if isShow}
	<div
		in:fadeIn
		out:fadeOut
		bind:this={statusbar} class="fixed z-10 h-7 w-screen top-0 left-0 shadow-2xl blur-0">
		<div
			class="backdrop-blur-md bg-white/30 w-screen h-full flex flex-row place-content-between select-none">
			<div class="place-self-center h-full flex flex-row">
				<AppleLogo on:down={()=>{showContextMenu(kernel.menuToolbarSystem,5)}}
				/>
				{#each applicationContext?.tools ?? kernel.toolbarSystem as tool}
					{#if tool.name === applicationContext?.name}
						<button on:click={(e)=>{showContextMenu(tool?.contextMenu ?? [],	e.target.offsetLeft)}}
										class=" font-bold text-xs px-2 rounded-sm focus:bg-gray-300 focus:bg-opacity-60 text-gray-900 dark:text-white"
						>
							{applicationContext?.name ?? ''}
						</button>
					{:else}
						<button on:click={(e)=>{showContextMenu(tool.contextMenu,e.target.offsetLeft)}}
										class="mx-0.5 min-w-max h-full text-center text-xs cursor-default focus:bg-gray-300 focus:bg-opacity-60 rounded-sm px-3 text-gray-900 dark:text-white">
							{tool.name}
						</button>
					{/if}

				{/each}
			</div>
			<div class="place-self-center flex flex-row">
				<Battery battery={50} />
				<Wifi state={'no-connection'} />
				<ActionToggle />
				<Siri />
				<StatusbarTime />
			</div>
		</div>
	</div>
{/if}