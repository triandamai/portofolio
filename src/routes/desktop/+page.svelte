<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fadeOut, fadeIn } from '$lib/utils/fade';
	import { type Application, type ApplicationState, kernel, Os } from '$lib/manifest/application.manifest';
	import Dock from '../../components/systemUI/dock/Dock.svelte';
	import DesktopMenuContext from '../../components/systemUI/context/DesktopContext.svelte';
	import Statusbar from '../../components/systemUI/statusbar/Statusbar.svelte';
	import DesktopContainer from '../../components/systemUI/window/DesktopContainer.svelte';
	import Launchpad from '../../components/systemUI/launchpad/Launchpad.svelte';
	import { normalizePosition, updateElementZ } from '../../components/systemUI/window/window';
	import StatusbarContext from '../../components/systemUI/context/StatusbarContext.svelte';
	import SystemUiContext from '../../components/systemUI/context/SystemUiContext.svelte';


	const { createWindowConfig } = Os();

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

	let activeApp: ApplicationState | null = null;
	let listStateApp: Map<string, ApplicationState> = new Map<string, ApplicationState>();

	async function loadComponent(componentName: string) {
		return await import(`../../applications/${componentName}.svelte`);
	}

	function showStatusBarAndDock(show: boolean = true) {
		if (show) {
			dock.show();
		} else {
			dock.hide();
		}
	}


	function onMinimizeApp(detail: Application) {
		if (!activeApp) return;
		if (activeApp.size === 'max') {
			showStatusBarAndDock(true);
		}
		let data = activeApp;
		data.state = 'idle';
		data.size = 'min';
		data.width = detail.component.width;
		data.height = detail.component.height;
		listStateApp.set(detail.appID, data);
		activeApp = null;
		listStateApp = listStateApp;
	}

	function onMaximizeApp(app: Application) {
		if (activeApp == null) return;
		let oldActive = activeApp;
		if (activeApp.size === 'min') {
			showStatusBarAndDock(false);
			oldActive.size = 'max';
			oldActive.width = screen.width;
			oldActive.height = screen.height;
		} else {
			showStatusBarAndDock(true);
			oldActive.size = 'min';
			oldActive.x = activeApp.x;
			if (oldActive.y < maxYOffset) {
				oldActive.y = maxYOffset;
			}
			oldActive.width = app.component.width;
			oldActive.height = app.component.height;
		}
		activeApp = oldActive;
	}

	function onCloseApp(detail: Application) {
		if (activeApp) {
			activeApp.state = 'close';
			listStateApp.set(detail.appID, activeApp);
			listStateApp = listStateApp;
			activeApp = null;
		}
	}

	function showLaunchpad() {
		if (launchpad.displayed()) {
			hideLaunchpad();
		} else {
			statusBar.hide();
			launchpad.show();
		}
	}

	function hideLaunchpad() {
		statusBar.show();
		launchpad.hide();
	}


	function onAppIconClick(data: { detail: { appID: string } }) {
		const detail = data.detail;
		if (detail.appID === 'launchpad') {
			showLaunchpad();
		} else {
			hideLaunchpad();
			//update or insert to list active app
			if (listStateApp.has(detail.appID)) {
				//open
				let findApp = listStateApp.get(detail.appID);
				if (findApp) {
					findApp.state = 'open';
					findApp.z = listStateApp.size + 1;
					findApp.x = x;
					findApp.y = y;

					activeApp = findApp;
					listStateApp = normalizePosition(listStateApp, findApp);
					updateElementZ(listStateApp, detail.appID);
				}
			} else {
				//insert from applications to active
				let findAppFromList = kernel.applications.find((v) => v.appID === detail.appID);
				if (findAppFromList) {
					let prevData = listStateApp;
					const index = () => {
						if (listStateApp.size < 0) return 1;
						else return listStateApp.size;
					};
					let newData: ApplicationState = {
						state: 'open',
						context: findAppFromList,
						z: index(),
						size: 'min',
						width: findAppFromList.component.width,
						height: findAppFromList.component.height,
						y: maxYOffset,
						x: 0
					};
					prevData.set(findAppFromList.appID, newData);
					activeApp = newData;
					listStateApp = normalizePosition(prevData, newData);
					updateElementZ(listStateApp, detail.appID);
				}
			}
		}
	}

	function getCurrentPosition(appID: string) {
		if (browser) {
			let component = document.getElementById(appID);
			if (component) {
				y = component.offsetTop;
				x = component.offsetLeft;
			}
		}
		onAppIconClick({ detail: { appID: appID } });
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
				if (activeApp) {
					let old = activeApp;
					old.x = x;
					old.y = y;
					activeApp = old;
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
			const statusbarInfo = statusBar.getStatusbarInfo();
			maxYOffset = (statusbarInfo.height + statusbarInfo.x);
			y = maxYOffset;
		}
		let w = screen.width;
		let h = screen.height;
		createWindowConfig(w, h, maxYOffset);
		if (browser) {
			screenHeight = window.innerHeight;
		}
	});
</script>
<svelte:window on:resize={(e)=>(screenHeight = window.innerHeight)} />
<DesktopMenuContext
	kernel={kernel}
/>
<StatusbarContext
	bind:this={statusBarMenuContext}
	kernel={kernel}
	on:clickOutside={({detail})=>{detail()}}
/>
<SystemUiContext
	bind:this={systemUI}
	kernel={kernel}
/>

<div
	in:fadeIn
	out:fadeOut
	class="main-layout w-screen h-screen relative">
	<Launchpad
		bind:this={launchpad}
		kernel={kernel}
		on:clickOutside={({detail})=>{
			hideLaunchpad()
			detail()
		}}
		on:click={(event)=>{
			onAppIconClick(event)
		}}
	/>
	<Statusbar
		bind:this={statusBar}
		applicationContext={activeApp}
		kernel={kernel}
		on:showMenuContext={({detail})=>{
			statusBarMenuContext.show(detail.x,detail.y,detail.contextMenu)
		}}
		on:systemui={({detail})=>{
			systemUI.show(detail,maxYOffset)
		}}
	/>

	<div
		use:moveApp
		class="z-0 flex flex-col justify-between h-screen">
		{#each kernel.applications as manifest}
			{#await loadComponent(manifest.component.componentName) then app}
				<DesktopContainer
					applicationContext={manifest}
					activeApplication={activeApp}
					applicationsState={listStateApp}
					kernel={kernel}
					let:width
					let:height
				>
					<svelte:component
						this={app.default}
						width={width}
						height={height}
						on:enableMove={()=>{
								moving = true
								if(activeApp.size !== "max"){
									getCurrentPosition(manifest.appID)
								}
							}}
						on:windowActive={()=>{
								moving = false
								if(activeApp.size !== "max"){
										getCurrentPosition(manifest.appID)
								}
							}}
						on:close={()=>{
								onCloseApp(manifest)
							}}
						on:minimize={()=>{
								onMinimizeApp(manifest)
							}}
						on:maximize={()=>{
								onMaximizeApp(manifest)
							}}
					/>
				</DesktopContainer>
			{/await}
		{/each}
	</div>
	<Dock
		bind:this={dock}
		on:click={onAppIconClick}
		activeApplication={listStateApp}
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
