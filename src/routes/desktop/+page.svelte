<script lang="ts">
	import { onMount } from 'svelte';
	import DesktopContainer from '../../components/systemUI/DesktopContainer.svelte';
	import { browser } from '$app/environment';
	import Statusbar from '../../components/systemUI/Statusbar.svelte';
	import {
		type Application,
		applications,
		menu_toolbar_system, type OptionsMenu,
		systemContext
	} from '$lib/manifest/application.manifest';
	import Dock from '../../components/systemUI/dock/Dock.svelte';
	import MenuContext from '../../components/systemUI/menuContext/MenuContext.svelte';


	let statusBar: HTMLDivElement;
	let statusBarMenuContext: MenuContext;
	let dock: HTMLDivElement;

	let bottomStatusBarOffset: number = 0;
	let currentContextMenu: Array<OptionsMenu> = systemContext;

	let moving: boolean = false;
	let oldY: number = 0;
	let y: number = 300;
	let x: number = 100;
	let current_active_app: Application | null = null;

	async function loadComponent(componentName: string) {
		return await import(`../../applications/${componentName}.svelte`);
	}

	function getCurrentPosition(name: string) {
		if (browser) {
			let component = document.getElementById(name);
			if (component) {
				y = component.offsetTop;
				x = component.offsetLeft;
			}
			moveToTop(name);
		}
	}

	function moveToTop(name: string) {
		applications.forEach((app) => {
			let component = document.getElementById(app.appID);
			if (component) {
				if (name == app.appID) {
					component.style.zIndex = `1`;
				} else {
					component.style.zIndex = `0`;
				}
			}
		});
	}


	function moveApp(_: HTMLElement) {
		window.addEventListener('mousemove', (e) => {
			if (moving && e.offsetX > 1) {
				if (e.pageY < oldY) {
					//top
					if (y > bottomStatusBarOffset && e.clientY > bottomStatusBarOffset) {
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
		bottomStatusBarOffset = (statusBar.offsetHeight + statusBar.offsetTop);
		y = bottomStatusBarOffset;

	});
</script>

<div class="main-layout w-screen h-screen relative">
	<MenuContext bind:this={statusBarMenuContext}>
		{#each currentContextMenu as context }
			{#if context.type === 'button'}
				<button on:click={()=>{
					statusBarMenuContext.hide()
				}}
								class="font-sf-regular text-start text-gray-900 text-sm pr-16 pl-2 rounded-md py-0.5 hover:bg-blue-500 hover:text-white">{context.name}</button>
			{:else }
				<div class="h-[0.05rem] w-full bg-gray-500 rounded-md my-0.5" />
			{/if}
		{/each}
	</MenuContext>

	<div bind:this={statusBar} class="fixed z-10 h-7 w-screen top-0 left-0 shadow-2xl blur-0">
		<Statusbar
			applicationContext={current_active_app}
			systemContextMenu={systemContext}
			systemToolbarMenu={menu_toolbar_system}
			on:showMenuContext={({detail})=>{
				currentContextMenu = detail.contextMenu
				statusBarMenuContext.show(detail.x,detail.y)
			}}
			on:hideMenuContext={()=>{
				statusBarMenuContext.hide()
			}}
		/>
	</div>
	<div
		use:moveApp
		class="z-0 flex flex-col justify-between h-screen">
		{#each applications as manifest}
			{#await loadComponent(manifest.component.componentName) then app}
				{#if manifest.state === 'open'}
					<DesktopContainer
						y={y}
						x={x}
						application_id={manifest.appID}
						current_application_active={current_active_app?.appID}
						width={manifest.component.width}
						height={manifest.component.height}
						on:down={()=>{
							current_active_app = manifest
							moveToTop(current_active_app?.appID)
					}}
					>
						<svelte:component
							this={app.default}
							on:headerDown={()=>{
								moving = true
								current_active_app = manifest
								getCurrentPosition(current_active_app?.appID)
						}}
						/>
					</DesktopContainer>
				{/if}
			{/await}
		{/each}
	</div>
	<div
		bind:this={dock}
		id="dock"
		class="fixed bottom-0 z-10 h-10 w-screen flex flex-row">
		<Dock />
	</div>
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
