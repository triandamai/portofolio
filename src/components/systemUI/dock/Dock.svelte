<script lang="ts">
	import DockItem from './DockItem.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Application } from '$lib/manifest/application.manifest';
	const dispatcher = createEventDispatcher()

	// export let apps:Array<Application> = []
	let pinnedApps =[
		'finder',
		'launchpad',
		'divider',
	]
	let apps = [
		'notes',
		'appstore',
		'calculator'
	];

	let mouseX: number | null = null;

</script>
<div
	class="fixed bottom-0 z-10 h-10 w-screen flex flex-row">
	<div class="dock-container">
		<div
			class="dock-el rounded-lg backdrop-blur-md bg-white/30"
			on:mousemove={(event)=>(mouseX = event.x)}
			on:mouseleave={()=>(mouseX = null)}
		>
			{#each pinnedApps as app}
				{#if app === 'divider'}
					<div class="divider bg-gray-900" aria-hidden="true" />
				{:else }
					<DockItem
						mouseX={mouseX}
						appID={app}
						on:click={()=>{
							dispatcher("click",{
								id:app
							})
						}}
					/>
				{/if}
			{/each}
			{#each apps as app}
				{#if app === 'divider'}
					<div class="divider bg-gray-900" aria-hidden="true" />
				{:else }
					<DockItem
						mouseX={mouseX}
						appID={app}
						on:click={()=>{
							dispatcher("click",{
								id:app
							})
						}}
					/>
				{/if}
			{/each}
		</div>
	</div>
</div>
<style lang="scss">
  .dock-container {
    margin-bottom: 0.3rem;
    left: 0;
    bottom: 0;
    z-index: 9900;
    position: fixed;

    width: 100%;
    height: 4.4rem;

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