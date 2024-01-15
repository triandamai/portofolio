<script lang="ts">
	import DockItem from './DockItem.svelte';
	import { createEventDispatcher } from 'svelte';
	import { type ApplicationState } from '$lib/manifest/application.manifest';

	const dispatcher = createEventDispatcher();

	export let activeApplication: Map<string, ApplicationState> = [];
	let mouseX: number | null = null;
	let isDividerShow: boolean = false;

	function onItemClick(appID: string) {
		dispatcher('click', {
			appID: appID
		});
	}

	function showDivider(app: Map<string, ApplicationState>) {
		if (app.size <= 0) {
			isDividerShow = false;
			return;
		}
		if (app.size == 1 && app.has('finder')) {
			isDividerShow = false;
			return;
		}
		isDividerShow = true;
	}

	$: showDivider(activeApplication);
</script>
<div
	class="fixed bottom-0 z-10 h-10 w-screen flex flex-row">
	<div class="dock-container">
		<div
			class="dock-el rounded-2xl backdrop-blur-md bg-white/30"
			on:mousemove={(event)=>(mouseX = event.x)}
			on:mouseleave={()=>(mouseX = null)}
		>
			<DockItem
				mouseX={mouseX}
				appID="launchpad"
				active={false}
				on:click={()=>{onItemClick('launchpad')}}
			/>
			<DockItem
				mouseX={mouseX}
				appID="finder"
				active={activeApplication.get('finder')?.state !== 'close'}
				on:click={()=>{onItemClick('finder')}}
			/>
			{#if isDividerShow}
				<div class="divider bg-gray-900" aria-hidden="true" />
			{/if}
			{#each [...activeApplication] as [key, app]}
				{#if key !== 'finder'}
					<DockItem
						mouseX={mouseX}
						appID={app.context.appID}
						active={activeApplication.get(key)?.state !== 'close'}
						on:click={()=>{onItemClick(key)}}
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