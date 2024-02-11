<script lang="ts">
	import type { Application, ApplicationState } from '$lib/core/type';
	import { sineInOut } from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';
	import {fly} from "svelte/transition"

	import DockItem from './DockItem.svelte';
	import { dockedApp ,Host} from '$lib/core/framework/host';

	const dispatcher = createEventDispatcher();

	export let activeApplication: Map<string, ApplicationState> = new Map();
	let mouseX: number | null = null;
	let isDividerShow: boolean = false;
	let isShow: boolean = true;



	export function show() {
		isShow = true;
	}

	export function hide() {
		isShow = false;
	}

	function onItemClick(app: Application) {
		dispatcher('click', app);
	}

	function onOpenLaunchpad(){
		dispatcher('launchpad',{});
	}
	function onOpenFinder(){
		dispatcher('finder',{});
	}

	function showDivider(app: Map<string, ApplicationState>) {
		if (app.size <= 0) {
			isDividerShow = false;
			return;
		}
		if (app.size == 1 && (app.has('finder') || app.has('about'))) {
			isDividerShow = false;
			return;
		}
		isDividerShow = true;
	}

	$: showDivider(activeApplication);
</script>
{#if isShow}
	<div
	in:fly={{
		easing: sineInOut,
		duration: 400,
		x: 0,
		y: 200
	}}
	out:fly={{
		easing: sineInOut,
		duration: 400,
		x: 0,
		y: 200
	}}
		class="fixed bottom-0 z-10 h-10 w-screen flex flex-row">
		<div class="dock-container">
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="dock-el rounded-2xl backdrop-blur-md bg-white/30"
				on:mousemove={(event)=>(mouseX = event.x)}
				on:mouseleave={()=>(mouseX = null)}
			>
				<DockItem
					mouseX={mouseX}
					appID="launchpad"
					active={false}
					on:click={onOpenLaunchpad}
				/>
				<DockItem
					mouseX={mouseX}
					appID="finder"
					active={$dockedApp.get('finder')?.state !== 'close'}
					on:click={onOpenFinder}
				/>
				{#if isDividerShow}
					<div class="divider bg-gray-900" aria-hidden="true" />
				{/if}
				{#each [...$dockedApp] as [key, app]}
					{#if key !== 'finder' && key !== 'about'}
						<DockItem
							mouseX={mouseX}
							appID={app.applicationInfo.applicationId}
							active={Host.getCurrentApplication()?.getApplicationInfo().applicationId === app.applicationInfo.applicationId}
							on:click={()=>{onItemClick(app)}}
						/>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if}
<style lang="scss">
  .dock-container {
    margin-bottom: 0.3rem;
    left: 0;
    bottom: 0;
    z-index: 9900;
    position: fixed;

    width: 100%;
    height: 4.8rem;

    padding: 0.4rem;

    display: flex;
    justify-content: center;
  }

  .dock-el {
    box-shadow: inset 0 0 0 0.2px rgba(93, 90, 90, 0.27),
    hsla(0, 0%, 0%, 0.11) 2px 5px 19px 7px;

    padding: 0.3rem;

    height: 100%;

    display: flex;
    align-items: flex-end;
  }

  .divider {
    height: 100%;
    width: 0.2px;
    margin: 0 4px;
  }
</style>