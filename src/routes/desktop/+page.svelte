<script lang="ts">
	import { onMount } from 'svelte';
	import { fadeIn, fadeOut } from '$lib/utils/fade';

	import Dock from '../../components/systemUI/dock/Dock.svelte';
	import DesktopMenuContext from '../../components/systemUI/context/DesktopContext.svelte';
	import Statusbar from '../../components/systemUI/statusbar/Statusbar.svelte';
	import DesktopContainer from '../../components/systemUI/window/DesktopContainer.svelte';
	import Launchpad from '../../components/systemUI/launchpad/Launchpad.svelte';
	import StatusbarContext from '../../components/systemUI/context/StatusbarContext.svelte';
	import SystemUiContext from '../../components/systemUI/context/SystemUiContext.svelte';
	import {  Host } from '$lib/core/framework/host';

	let statusBarMenuContext: StatusbarContext;

	let systemUI: SystemUiContext;

	let moving: boolean = false;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function moveApp(_: HTMLElement) {
		window.addEventListener('mousemove', (e: MouseEvent) => {
			if (moving && e.offsetX > 1) {
				Host.appManager().getActiveApplication()?.moveApplication(e, 28);
			}
		});

		window.addEventListener('mouseup', () => {
			moving = false;
		});
	}

	function enableMove(isEnable: boolean) {
		moving = isEnable;
	}

	function onFullScreenMode(isFull: boolean) {
		if (isFull) {
			Host.statusbarManager().hideStatusbar()
			Host.dockManager().hideDock();
		} else {
			Host.statusbarManager().showStatusbar()
			Host.dockManager().showDock()
		}
	}

	function onMouseHoverWhenFullScreen(yPosition: number) {
		if (Host.appManager().getIsFullscreenMode()) {
			//when mouse hover on top
			if (yPosition <= Host.systemManager().getMaxYOffset() * 2) {
				if (!Host.statusbarManager().getIsStatusbarShow()) {
					Host.statusbarManager().showStatusbar()
				}
			} else {
				if (Host.statusbarManager().getIsStatusbarShow()) {
					Host.statusbarManager().hideStatusbar()
				}
			}

			if (yPosition <= Host.systemManager().getHeight() - 50) {
				Host.dockManager().hideDock()
			} else {
				Host.dockManager().showDock()
			}
		}
	}
	onMount(() => {
		Host.statusbarManager().showStatusbar()
		Host.dockManager().showDock()
		Host.appManager().addOnMoveEnabledChangeListener('page', enableMove);
		Host.appManager().addOnFullscreenModeChangeListener('page', onFullScreenMode);
		return () => {};
	});
</script>

<svelte:window
	on:resize={() => {
		let screen = document.body;
		Host.systemManager().setWidth(screen.clientWidth);
		Host.systemManager().setHeight(screen.clientHeight);
	}}
	on:mousemove={(e) => {
		onMouseHoverWhenFullScreen(e.y);
	}}
/>
<DesktopMenuContext />
<StatusbarContext
	bind:this={statusBarMenuContext}
	on:clickOutside={({ detail }) => {
		detail();
	}}
/>
<SystemUiContext bind:this={systemUI} />

<div in:fadeIn out:fadeOut class="main-layout w-screen h-screen relative">
	<Launchpad
		on:clickOutside={() => {
			Host.launchpadManager().hideLaunchpad()
			if (Host.appManager().getIsFullscreenMode()) {
				Host.statusbarManager().hideStatusbar()
			} else {
				Host.statusbarManager().showStatusbar()
			}
		}}
		on:click={({ detail }) => {
			Host.launchpadManager().hideLaunchpad()
			Host.statusbarManager().showStatusbar()
			detail.openApplication();
		}}
	/>
	<Statusbar
		on:showMenuContext={({ detail }) => {
			statusBarMenuContext.show(detail.x, detail.y, detail.contextMenu);
		}}
		on:systemui={({ detail }) => {
			systemUI.show(detail.x, 28);
		}}
	/>

	<div use:moveApp class="z-0 flex flex-col justify-between h-screen">
		{#each Array.from(Host.appManager().getListApplication().values()) as manifest}
			{#await Host.loadApplication(manifest) then app}
				<DesktopContainer context={manifest} let:width let:height>
					<svelte:component this={app.default} {width} {height} context={manifest} />
				</DesktopContainer>
			{/await}
		{/each}
	</div>
	<Dock
		on:click={({ detail }) => {
			Host.launchpadManager().hideLaunchpad()
			detail.openApplication();
		}}
		on:finder={() => {
			Host.findApplication('finder')?.openApplication();
		}}
		on:launchpad={() => {
			if (Host.launchpadManager().getIsLaunchpadShow()) {
				Host.launchpadManager().hideLaunchpad()
			} else {
				Host.launchpadManager().showLaunchpad()
			}
		}}
	/>
</div>

<style>
	.main-layout {
		position: fixed;
		background-image: url($lib/walpaper/big-sur-7.jpg);
		background-repeat: no-repeat;
		background-size: cover;
		background-color: #949494;
	}
</style>
