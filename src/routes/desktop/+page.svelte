<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fadeOut, fadeIn } from '$lib/utils/fade';
	import type { Application, ApplicationState } from '$lib/core/type';
	import { MacOs, macos, registerEvent, unregisterEvent } from '$lib/core/system/macos';
	import {
		notifyPositionChanged,
		notifyAppClose,
		notifyAppMaximize,
		notifyAppOpen,
		notifyAppMinimize,
		currentApplication,
		updateActiveApplication,
		closeApplication,
		activeApplication,
		invalidateActiveApp,
		openApplication,
		loadApplication
	} from '$lib/core/application';

	import Dock from '../../components/systemUI/dock/Dock.svelte';
	import DesktopMenuContext from '../../components/systemUI/context/DesktopContext.svelte';
	import Statusbar from '../../components/systemUI/statusbar/Statusbar.svelte';
	import DesktopContainer from '../../components/systemUI/window/DesktopContainer.svelte';
	import Launchpad from '../../components/systemUI/launchpad/Launchpad.svelte';
	import { normalizePosition, updateElementZ } from '../../components/systemUI/window/window';
	import StatusbarContext from '../../components/systemUI/context/StatusbarContext.svelte';
	import SystemUiContext from '../../components/systemUI/context/SystemUiContext.svelte';

	const { createWindowConfig } = MacOs();

	let statusBar: Statusbar;
	let statusBarMenuContext: StatusbarContext;
	let launchpad: Launchpad;
	let dock: Dock;
	let systemUI: SystemUiContext;

	let screenHeight: number = 0;
	let maxYOffset: number = 0;
	let moving: boolean = false;

	let oldY: number = 0;
	let y: number = 300;
	let x: number = 100;

	function onMinimizeApp(detail: Application) {
		if (!$currentApplication) return;
		if ($currentApplication.size === 'max') {
			statusBar.show();
			dock.show();
		}
		const activeApp = $currentApplication;
		activeApp.height = detail.component.height;
		activeApp.width = detail.component.width;
		activeApp.state = 'idle';
		activeApp.size = 'min';
		notifyAppMinimize(detail.appID, detail.component.width, detail.component.height);
		updateActiveApplication(activeApp);
		currentApplication.set(null);
	}

	function onMaximizeApp(app: Application) {
		if ($currentApplication == null) return;
		let oldActive = $currentApplication;
		if ($currentApplication.size === 'min') {
			notifyAppMaximize(app.appID, screen.width, screen.height, 0, 0);
			oldActive.size = 'max';
			currentApplication.set(oldActive);
			statusBar.hide();
			dock.hide();
		} else {
			if (oldActive.y < maxYOffset) {
				oldActive.y = maxYOffset;
			}
			notifyAppMaximize(
				app.appID,
				app.component.width,
				app.component.height,
				oldActive.x,
				oldActive.y
			);
			oldActive.size = 'min';
			currentApplication.set(oldActive);
			statusBar.show();
			dock.show();
		}
	}

	function openFinder() {
		const app = macos.applications.find((app) => app.appID === 'finder');
		if (app) {
			openApp(app);
		}
	}

	function onCloseApp(detail: Application) {
		if ($currentApplication) {
			currentApplication.set(null);
			notifyAppClose(detail.appID);
			closeApplication(detail.appID);
		}
	}

	function showLaunchpad() {
		if (launchpad.displayed()) {
			statusBar.show();
			launchpad.hide();
		} else {
			statusBar.hide();
			launchpad.show();
		}
	}

	function openApp(data: Application) {
		statusBar.show();
		launchpad.hide();
		//update or insert to list active app
		if ($activeApplication.has(data.appID)) {
			//open
			let findApp = $activeApplication.get(data.appID);
			if (findApp) {
				findApp.state = 'open';
				findApp.z = $activeApplication.size;
				findApp.x = x;
				findApp.y = y;

				currentApplication.set(findApp);
				openApplication(findApp);
				notifyAppOpen($currentApplication?.context.appID ?? '', x, y);

				invalidateActiveApp(normalizePosition($activeApplication, findApp));
			}
		} else {
			//insert from applications to active
			let findAppFromList = macos.applications.find((app) => app.appID === data.appID);
			if (findAppFromList) {
				const index = () => {
					if ($activeApplication.size < 0) return 1;
					else return $activeApplication.size;
				};
				const posX = (macos.screen.width / 2 + findAppFromList.component.width / 2) / 2;
				const posY =
					((macos.screen.height - maxYOffset) / 2 + findAppFromList.component.height / 2) / 3;

				const newData: ApplicationState = {
					state: 'open',
					context: findAppFromList,
					z: index(),
					size: 'min',
					width: findAppFromList.component.width,
					height: findAppFromList.component.height,
					y: posY,
					x: posX
				};
				currentApplication.set(newData);
				notifyAppOpen($currentApplication?.context.appID ?? '', posX, posY);
				openApplication(newData);

				invalidateActiveApp(normalizePosition($activeApplication, newData));
			}
		}
	}

	function getCurrentPosition(app: Application) {
		if (browser) {
			let component = document.getElementById(app.appID);
			if (component) {
				y = component.offsetTop;
				x = component.offsetLeft;
			}
		}
		openApp(app);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function moveApp(_: HTMLElement) {
		window.addEventListener('mousemove', (e) => {
			if (moving && e.offsetX > 1) {
				if (e.pageY < oldY) {
					//top
					if (y > maxYOffset && e.clientY > maxYOffset) {
						x += e.movementX;
						y += e.movementY;
					}
				} else {
					//bottom
					x += e.movementX;
					y += e.movementY;
				}
				oldY = e.pageY;
				if ($currentApplication?.size === 'min') {
					currentApplication.update((old) => {
						if (old) {
							old.x = x;
							old.y = y;
						}
						return old;
					});
					notifyPositionChanged($currentApplication?.context.appID ?? '', x, y);
				}
			}
		});

		window.addEventListener('mouseup', () => {
			moving = false;
		});
	}
	onMount(() => {
		//initialize default y position for apps
		if (statusBar) {
			statusBar.show();
			const statusbarInfo = statusBar.getStatusbarInfo();
			maxYOffset = statusbarInfo.height + statusbarInfo.x;
			y = maxYOffset;
		}
		if (dock) {
			dock.show();
		}
		let w = screen.width;
		let h = screen.height;
		createWindowConfig(w, h, maxYOffset);
		if (browser) {
			screenHeight = window.innerHeight;
		}
		activeApplication.subscribe((data) => {
			updateElementZ(data, $currentApplication?.context.appID ?? '');
		});

		registerEvent({
			onEnableMoveApp: function (target: Application): void {
				if ($currentApplication?.size !== 'max') {
					moving = true;
					getCurrentPosition(target);
				}
			},
			onAppActiveChanged: function (target: Application): void {
				getCurrentPosition(target);
			},
			openApp: function (target: Application): void {
				openApp(target);
			},
			closeApp: function (target: Application): void {
				onCloseApp(target);
			},
			minimizeApp: function (target: Application): void {
				onMinimizeApp(target);
			},
			maximizeApp: function (target: Application): void {
				onMaximizeApp(target);
			}
		});

		return () => {
			unregisterEvent();
		};
	});
</script>

<svelte:window
	on:resize={(e) => (screenHeight = window.innerHeight)}
	on:mousemove={(e) => {
		//show or hide status bar and dock
		if ($currentApplication?.size === 'max') {
			if (!statusBar.getStatusbarInfo().isShow) {
				if (e.y < 10) {
					statusBar.show();
				}
			} else {
				if (e.y > maxYOffset) {
					statusBar.hide();
				}
			}

			if (e.y >= screenHeight - 50) {
				dock.show();
			} else {
				dock.hide();
			}
		}
	}}
/>
<DesktopMenuContext {macos} />
<StatusbarContext
	bind:this={statusBarMenuContext}
	{macos}
	on:clickOutside={({ detail }) => {
		detail();
	}}
/>
<SystemUiContext bind:this={systemUI} {macos} />

<div in:fadeIn out:fadeOut class="main-layout w-screen h-screen relative">
	<Launchpad
		bind:this={launchpad}
		{macos}
		on:clickOutside={({ detail }) => {
			launchpad.hide();
			statusBar.show();
			detail();
		}}
		on:click={({ detail }) => openApp(detail)}
	/>
	<Statusbar
		bind:this={statusBar}
		applicationContext={$currentApplication}
		{macos}
		on:showMenuContext={({ detail }) => {
			statusBarMenuContext.show(detail.x, detail.y, detail.contextMenu);
		}}
		on:systemui={({ detail }) => {
			systemUI.show(detail, maxYOffset);
		}}
	/>

	<div use:moveApp class="z-0 flex flex-col justify-between h-screen">
		{#each macos.applications as manifest}
			{#await loadApplication(manifest) then app}
				<DesktopContainer context={manifest} {macos} let:width let:height>
					<svelte:component this={app.default} {width} {height} context={manifest} />
				</DesktopContainer>
			{/await}
		{/each}
	</div>
	<Dock
		bind:this={dock}
		activeApplication={$activeApplication}
		on:click={({ detail }) => openApp(detail)}
		on:finder={openFinder}
		on:launchpad={(e) => showLaunchpad()}
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
