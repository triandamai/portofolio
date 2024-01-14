<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fly } from 'svelte/transition';
	import {
		type Application,
		type ApplicationState,
		type OptionsMenu,
		kernel,
		Os
	} from '$lib/manifest/application.manifest';
	import Dock from '../../components/systemUI/dock/Dock.svelte';
	import MenuContext from '../../components/framework/MenuContext.svelte';
	import MenuContextItem from '../../components/framework/MenuContextItem.svelte';
	import DesktopMenuContext from '../../components/systemUI/context/DesktopContext.svelte';
	import Statusbar from '../../components/systemUI/statusbar/Statusbar.svelte';
	import DesktopContainer from '../../components/systemUI/window/DesktopContainer.svelte';
	import Launchpad from '../../components/systemUI/launchpad/Launchpad.svelte';
	import { updateElementZ } from '../../components/systemUI/window/window';
	import { goto } from '$app/navigation';


	const { broadcastEvent } = Os();

	let statusBar: Statusbar;
	let statusBarMenuContext: MenuContext;
	let currentStatusbarMenuContext: Array<OptionsMenu> = kernel.menuToolbarSystem;

	let launchpad: Launchpad;

	let maxYOffset: number = 0;
	let moving: boolean = false;
	let oldY: number = 0;
	let y: number = 300;
	let x: number = 100;

	let activeApp: Application | null = null;
	let listStateApp: Array<ApplicationState> = [];

	async function loadComponent(componentName: string) {
		return await import(`../../applications/${componentName}.svelte`);
	}


	function onMinimizeApp(idx: number, detail: Application) {
		let findIndex = listStateApp.map(v => v.context.appID).indexOf(detail.appID);
		listStateApp[findIndex].state = 'idle';
		listStateApp = listStateApp;
	}

	function onMaximizeApp(_: number, app: Application) {
		app;
	}

	function onCloseApp(idx: number, detail: Application) {
		let findIndex = listStateApp.map(v => v.context.appID).indexOf(detail.appID);
		listStateApp.splice(findIndex, 1);
		listStateApp = listStateApp;
	}

	function onAppIconClick(data: { detail: { appID: string } }) {
		const detail = data.detail;
		if (detail.appID === 'launchpad') {
			if (launchpad.displayed()) {
				statusBar.show();
				launchpad.hide();
			} else {
				statusBar.hide();
				launchpad.show();
			}
		} else {
			statusBar.show();
			launchpad.hide();

			const findApp = listStateApp.find((v) => v.context.appID === detail.appID);
			if (findApp) {
				//open
				listStateApp.forEach((v, index) => {
					if (listStateApp[index].context.appID === findApp.context.appID) {
						listStateApp[index].state = 'open';
						listStateApp[index].z = listStateApp.length;
					} else {
						listStateApp[index].z = (listStateApp.length - 1);
					}
				});
				activeApp = findApp.context;
				listStateApp = listStateApp;
			} else {
				//insert from applications to active
				let findAppFromList = kernel.applications.find((v) => v.appID === detail.appID);
				if (findAppFromList) {
					let prevData = listStateApp;
					const index = () => {
						if (listStateApp.length < 0) return 1;
						else return listStateApp.length;
					};
					prevData.push({
						state: 'open',
						context: findAppFromList,
						z: index()
					});
					activeApp = findAppFromList;
					listStateApp.forEach((v, index) => {
						if (listStateApp[index].context.appID !== detail.appID) {
							listStateApp[index].z = (listStateApp[index].z - 1);
						}
					});
					listStateApp = listStateApp;
				}
			}
		}
		updateElementZ(listStateApp);
	}

	function hideLaunchpad() {
		launchpad.hide();
		statusBar.show();
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
	});
</script>
<DesktopMenuContext />
<MenuContext
	bind:this={statusBarMenuContext}
	on:clickOutside={({detail})=>{detail()}}
>
	{#each currentStatusbarMenuContext as context }
		<MenuContextItem
			type={context.type}
			name={context.name}
			on:itemClick={()=>{
					statusBarMenuContext.hide()
					if(context.name === 'LockScreen' || context.name === 'Log Out'){
						goto("/lock")
					}else {
						broadcastEvent("ini data")
					}
			}}
		/>
	{/each}
</MenuContext>
<div
	in:fly={{ x: -200, duration: 300, delay: 1000 }}
	out:fly={{ x: 200, duration: 300 }}
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
			currentStatusbarMenuContext = detail.contextMenu
			statusBarMenuContext.show(detail.x,detail.y)
		}}
	/>

	<div
		use:moveApp
		class="z-0 flex flex-col justify-between h-screen">
		{#each kernel.applications as manifest,index}
			{#await loadComponent(manifest.component.componentName) then app}
				<DesktopContainer
					y={y}
					x={x}
					application_id={manifest.appID}
					activeApplication={activeApp?.appID}
					applicationsState={listStateApp}
					width={manifest.component.width}
					height={manifest.component.height}
					on:down={()=>{
							activeApp = manifest
							onAppIconClick({detail:{
								appID:manifest.appID
							}})
					}}
				>
					<svelte:component
						this={app.default}
						on:move={()=>{
								moving = true
								activeApp = manifest
								getCurrentPosition(activeApp?.appID)
							}}
						on:close={()=>{
								onCloseApp(index,manifest)
							}}
						on:minimize={()=>{
								onMinimizeApp(index,manifest)
							}}
						on:maximize={()=>{
								onMaximizeApp(index,manifest)
							}}
					/>
				</DesktopContainer>
			{/await}
		{/each}
	</div>
	<Dock
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
