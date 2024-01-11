<script lang="ts">
	import DockItem from './DockItem.svelte';

	let apps = [
		'finder',
		'divider',
		'notes',
		"appstore",
		"calculator",
		"launchpad"
	];

	let mouseX: number | null = null;

</script>
<div class="dock-container">
	<div
		class="dock-el rounded-lg backdrop-blur-md bg-white/30"
		on:mousemove={(event)=>(mouseX = event.x)}
		on:mouseleave={()=>(mouseX = null)}
	>
		{#each apps as app}
			{#if app === 'divider'}
				<div class="divider bg-gray-900" aria-hidden="true" />
			{:else }
				<DockItem mouseX={mouseX} appID={app} />
			{/if}
		{/each}
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
    box-shadow: inset 0 0 0 0.2px rgb(245 245 245 / 70%),
    hsla(0, 0%, 0%, 0.3) 2px 5px 19px 7px;

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