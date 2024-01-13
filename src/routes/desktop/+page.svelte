<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { fly } from 'svelte/transition';
	import {
		type Application,
		applications, type ApplicationState,
		menu_toolbar_system, type OptionsMenu,
		systemContext
	} from '$lib/manifest/application.manifest';
	import Dock from '../../components/systemUI/dock/Dock.svelte';
	import MenuContext from '../../components/framework/MenuContext.svelte';
	import MenuContextItem from '../../components/framework/MenuContextItem.svelte';
	import DesktopContext from '../../components/systemUI/context/DesktopContext.svelte';
	import Statusbar from '../../components/systemUI/statusbar/Statusbar.svelte';
	import DesktopContainer from '../../components/systemUI/window/DesktopContainer.svelte';
	import Launchpad from '../../components/systemUI/launchpad/Launchpad.svelte';
	import { updateElementZ } from '../../components/systemUI/window/window';


	let statusBar: Statusbar;
	let statusBarMenuContext: MenuContext;
	let currentStatusbarMenuContext: Array<OptionsMenu> = systemContext;

	let launchpad: Launchpad;

	let maxYOffset: number = 0;
	let moving: boolean = false;
	let oldY: number = 0;
	let y: number = 300;
	let x: number = 100;

	let current_active_app: Application | null = null;
	let stateActiveApp: Array<ApplicationState> = [];

	async function loadComponent(componentName: string) {
		return await import(`../../applications/${componentName}.svelte`);
	}


	function onMinimizeApp(idx: number, detail: Application) {
		let findIndex = stateActiveApp.map(v => v.context.appID).indexOf(detail.appID);
		stateActiveApp[findIndex].state = 'idle';
		stateActiveApp = stateActiveApp;
	}

	function onMaximizeApp(idx: number, detail: Application) {

	}

	function onCloseApp(idx: number, detail: Application) {
		let findIndex = stateActiveApp.map(v => v.context.appID).indexOf(detail.appID);
		stateActiveApp.splice(findIndex, 1);
		stateActiveApp = stateActiveApp;
	}

	function onAppIconClick({ detail }) {
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

			const findApp = stateActiveApp.find((v) => v.context.appID === detail.appID);
			if (findApp) {
				//open
				stateActiveApp.forEach((v, index) => {
					if (stateActiveApp[index].context.appID === findApp.context.appID) {
						stateActiveApp[index].state = 'open';
						stateActiveApp[index].z = stateActiveApp.length;
					} else {
						stateActiveApp[index].z = (stateActiveApp.length - 1);
					}
				});
				stateActiveApp = stateActiveApp;
			} else {
				//insert from applications to active
				let findAppFromList = applications.find((v) => v.appID === detail.appID);
				let prevData = stateActiveApp;
				const index = () => {
					if (stateActiveApp.length < 0) return 1;
					else return stateActiveApp.length;
				};
				prevData.push({
					state: 'open',
					context: findAppFromList,
					z: index()
				});
				stateActiveApp.forEach((v, index) => {
					if (stateActiveApp[index].context.appID !== detail.appID) {
						stateActiveApp[index].z = (stateActiveApp[index].z - 1);
					}
				});
				stateActiveApp = stateActiveApp;
			}
		}
		updateElementZ(stateActiveApp);
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
<DesktopContext />
<MenuContext
	bind:this={statusBarMenuContext}
	on:clickOutside={({detail})=>{
			detail()
		}}
>
	{#each currentStatusbarMenuContext as context }
		<MenuContextItem
			type={context.type}
			name={context.name}
			on:itemClick={()=>{
					statusBarMenuContext.hide()
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
		application={applications}
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
		applicationContext={current_active_app}
		systemContextMenu={systemContext}
		systemToolbarMenu={menu_toolbar_system}
		on:showMenuContext={({detail})=>{
			currentStatusbarMenuContext = detail.contextMenu
			statusBarMenuContext.show(detail.x,detail.y)
		}}
	/>

	<div
		use:moveApp
		class="z-0 flex flex-col justify-between h-screen">
		{#each applications as manifest,index}
			{#await loadComponent(manifest.component.componentName) then app}
				<DesktopContainer
					y={y}
					x={x}
					application_id={manifest.appID}
					current_application_active={current_active_app?.appID}
					applicationsState={stateActiveApp}
					width={manifest.component.width}
					height={manifest.component.height}
					on:down={()=>{
							current_active_app = manifest
							onAppIconClick({detail:{
								appID:manifest.appID
							}})
					}}
				>
					<svelte:component
						this={app.default}
						on:headerDown={()=>{
								moving = true
								current_active_app = manifest
								getCurrentPosition(current_active_app?.appID)
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
		activeApplication={stateActiveApp}
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
