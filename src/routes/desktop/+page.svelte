<script lang="ts">
	import { onMount } from 'svelte';
	import DesktopContainer from '../../components/systemUI/DesktopContainer.svelte';
	import { browser } from '$app/environment';
	import Statusbar from '../../components/systemUI/Statusbar.svelte';
	import { type Application, applications } from '$lib/manifest/application.manifest';
	import Dock from '../../components/systemUI/dock/Dock.svelte';

	let statusBar: HTMLDivElement;
	let dock: HTMLDivElement;

	let bottomStatusBarOffset: number = 0;

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
			let component = document.getElementById(app.name);
			if (component) {
				if (name == app.name) {
					component.style.zIndex = `1`;
				} else {
					component.style.zIndex = `0`;
				}
			}
		});
	}


	function moveApp(node: HTMLElement) {
		node;
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

<div class="main-layout w-screen h-screen bg-gray-400 relative">
	<div bind:this={statusBar}
			 class="absolute z-10 h-7 w-screen backdrop-blur-md bg-white/10 opacity-90 top-0 left-0 shadow-2xl blur-0">
		<Statusbar />
	</div>
	<div
		use:moveApp
		class="absolute z-0 flex flex-col justify-between h-screen">
		{#each applications as manifest}
			{#await loadComponent(manifest.component) then app}
				{#if manifest.state === 'open'}
					<DesktopContainer
						y={y}
						x={x}
						application_id={manifest.appID}
						current_application_active={current_active_app?.appID}
						width={manifest.width}
						height={manifest.height}
						on:down={()=>{
							current_active_app = manifest
							moveToTop(manifest.appID)
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
			<Dock/>
	</div>
</div>

<style>
    .main-layout {
        position: fixed;
        background-image: url($lib/walpaper/big-sur-2.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        background-color: aqua;
    }
</style>
