<script lang="ts">
	import { onMount } from 'svelte';
	import DesktopContainer from '../../components/systemUI/window/DesktopContainer.svelte';
	import { browser } from '$app/environment';
	import Statusbar from '../../components/systemUI/Statusbar.svelte';
	import {
		type Application,
		applications,
		menu_toolbar_system, type OptionsMenu,
		systemContext
	} from '$lib/manifest/application.manifest';
	import Dock from '../../components/systemUI/dock/Dock.svelte';
	import MenuContext from '../../components/framework/MenuContext.svelte';
	import MenuContextItem from '../../components/framework/MenuContextItem.svelte';
	import DesktopContext from '../../components/systemUI/context/DesktopContext.svelte';
	import { normalizeZIndex } from '../../components/systemUI/window/window';

	let dock: HTMLDivElement;
	let statusBar: HTMLDivElement;
	let statusBarMenuContext: MenuContext;
	let currentStatusbarMenuContext: Array<OptionsMenu> = systemContext;

	let maxYOffset: number = 0;
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
			normalizeZIndex(applications,name);
		}
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
		maxYOffset = (statusBar.offsetHeight + statusBar.offsetTop);
		y = maxYOffset;

	});
</script>

<DesktopContext/>
<div class="main-layout w-screen h-screen relative">
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
				on:itemClick={({detail})=>{
					statusBarMenuContext.hide()
				}}
			/>
		{/each}
	</MenuContext>

	<div bind:this={statusBar} class="fixed z-10 h-7 w-screen top-0 left-0 shadow-2xl blur-0">
		<Statusbar
			applicationContext={current_active_app}
			systemContextMenu={systemContext}
			systemToolbarMenu={menu_toolbar_system}
			on:showMenuContext={({detail})=>{
				currentStatusbarMenuContext = detail.contextMenu
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
							normalizeZIndex(applications,current_active_app?.appID)
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
