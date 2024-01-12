<script lang="ts">
	import Window from '../components/Window.svelte';
	import Draggable from '../components/Draggable.svelte';
	import AppContainer from '../components/AppContainer.svelte';
	import { browser } from '$app/environment';

	let movingTop: number = 400;
	let movingLeft: number = 300;
	let oldY: number = 0;
	let moving: boolean = false;
	let active_app: string = '';
	let list_active_app: Array<{
		name: string,
		component: string,
		width: number,
		height: number
	}> = [
		{
			name: 'Note',
			width: 800,
			height: 500,
			component: 'Note'
		},
		{
			name: 'Finder',
			width: 800,
			height: 500,
			component: 'Finder'
		}
	];

	function getCurrentPosition(name: string) {
		if (browser) {
			let component = document.getElementById(name);
			if (component) {
				movingTop = component.offsetTop;
				movingLeft = component.offsetLeft;
			}
			moveToTop(name);
		}
	}

	function moveToTop(name: string) {
		list_active_app.forEach((app) => {
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

	async function loadComponent(componentName: string) {
		return await import(`../apps/${componentName}.svelte`);
	}
</script>

<div class="main-layout w-screen h-screen bg-gray-400">
	<div class="flex flex-col justify-between h-screen">

		<Window
			on:onItemDock={({ detail }) => {
				console.log(detail)
			}}>
			<Draggable
				xtop={movingTop}
				yleft={movingLeft}
				oldY={oldY}
				moving={moving}
				on:move={({detail})=>{
				if(moving){
					movingTop += detail.top
					movingLeft += detail.left
				}
		}}
				on:y={({detail})=>{
				oldY = detail.y
		}}
				on:stop={()=>{
				moving=false
		}}
			>
				{#each list_active_app as w}
					{#await loadComponent(w.component) then app}
						<AppContainer
							moving={active_app === w.name}
							top={movingTop}
							left={movingLeft}
							width={w.width}
							height={w.height}
							container_name={w.name}
						>
							<svelte:component
								this={app.default}
								on:down={()=>{
								active_app = w.name
								getCurrentPosition(w.name)
								moving=true
						}}
								on:maximize={()=>{
								console.log("max")
							}}
								on:minimize={()=>{
								console.log("min")
							}}
								on:close={()=>{
								console.log("close")
							}}
							/>
						</AppContainer>
					{/await}
				{/each}
			</Draggable>
		</Window>
	</div>
</div>

<style>
    .main-layout {
        background-image: url($lib/image/walpaper.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        background-color: aqua;
    }
</style>