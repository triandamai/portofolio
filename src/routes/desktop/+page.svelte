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
	import { host, Host } from '$lib/core/framework/host';

	let statusBar: Statusbar;
	let statusBarMenuContext: StatusbarContext;
	let launchpad: Launchpad;
	let dock: Dock;
	let systemUI: SystemUiContext;

	let moving: boolean = false;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function moveApp(_: HTMLElement) {
		window.addEventListener('mousemove', (e: MouseEvent) => {
			if (moving && e.offsetX > 1) {
				Host.getCurrentApplication()?.moveApplication(e, 28);
			}
		});

		window.addEventListener('mouseup', () => {
			moving = false;
		});
	}

	function enableMove() {
		moving = true;
	}

	function onFullScreenMode(isFull: boolean) {
		if (isFull) {
			statusBar.hide();
			dock.hide();
		} else {
			statusBar.show();
			dock.show();
		}
	}

	function onMouseHoverWhenFullScreen(yPosition: number) {
		if (host.getFullScreenMode()) {
			//when mouse hover on top
			if (yPosition <= host.getMaxYOffset() * 2) {
				if (!statusBar.getStatusbarInfo().isShow) {
					statusBar.show();
				}
			} else {
				if (statusBar.getStatusbarInfo().isShow) {
					statusBar.hide();
				}
			}

			if (yPosition <= host.getHeight() - 50) {
				dock.hide();
			} else {
				dock.show();
			}
		}
	}
	onMount(() => {
		//initialize default y position for apps
		if (statusBar) {
			statusBar.show();
		}
		if (dock) {
			dock.show();
		}
		host.addOnEnableMoveListener(enableMove);
		host.addOnFullScreenChange(onFullScreenMode);
		return () => {};
	});
</script>

<svelte:window
	on:resize={(e) => {
		let screen = document.body;
		host.setWidth(screen.clientWidth);
		host.setHeight(screen.clientHeight);
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
		bind:this={launchpad}
		on:clickOutside={() => {
			launchpad.hide();
			if (host.getFullScreenMode()) {
				statusBar.hide();
			} else {
				statusBar.show();
			}
		}}
		on:click={({ detail }) => {
			launchpad.hide();
			statusBar.show();
			detail.openApplication();
		}}
	/>
	<Statusbar
		bind:this={statusBar}
		currentApplication={Host.getCurrentApplication()}
		on:showMenuContext={({ detail }) => {
			statusBarMenuContext.show(detail.x, detail.y, detail.contextMenu);
		}}
		on:systemui={({ detail }) => {
			systemUI.show(detail.x, 28);
		}}
	/>

	<div use:moveApp class="z-0 flex flex-col justify-between h-screen">
		{#each [...Host.getApplicationList()] as [_, manifest]}
			{#await Host.loadApplication(manifest) then app}
				<DesktopContainer context={manifest} let:width let:height>
					<svelte:component this={app.default} {width} {height} context={manifest} />
				</DesktopContainer>
			{/await}
		{/each}
	</div>
	<Dock
		bind:this={dock}
		on:click={({ detail }) => {
			detail.openApplication();
		}}
		on:finder={() => {
			Host.findApplication('finder')?.openApplication();
		}}
		on:launchpad={() => {
			if (launchpad.displayed()) {
				launchpad.hide();
				statusBar.show();
			} else {
				launchpad.show();
				statusBar.hide();
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
