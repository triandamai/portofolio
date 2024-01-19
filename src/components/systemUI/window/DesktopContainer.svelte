<script lang="ts">
	import {  onMount } from 'svelte';
	import type { Application, OptionsMenu, OsKernel } from '$lib/core/type';
	import { fadeIn, fadeOut } from '$lib/utils/fade';
	import { tweened } from 'svelte/motion';
	import { sineInOut } from 'svelte/easing';
	import { subscribe,unsubscribe,activeApplication } from '$lib/core/application';
	import { maximizeApplication } from '$lib/core/system/macos';

	export let context: Application;
	export let macos: OsKernel;

	const width = tweened(0, {
		duration: 200,
		easing: sineInOut
	});
	const height = tweened(0, {
		duration: 200,
		easing: sineInOut
	});
	let maxYOffset: number = 28;
	let positionX:number=0
	let positionY:number=28
	let zIndex:number =0

	let show: boolean = false;
	let app: HTMLDivElement;

	function minimize(w:number,h:number){
		console.log(`minimize`,`${context.appID} w:${w} h:${h}`)
		width.set(w);
		height.set(h);
		show=false
	}

	function maximize(w:number,h:number,x:number,y:number){
		width.set(w);
		height.set(h);
		positionX = x
		positionY = y
	}

	export function moveApplication(x:number,y:number) {
		positionX = x
		positionY = y
	}


	function initApp(app: Application) {
		width.set(app.component.width);
		height.set(app.component.height);
	}

	function initContext(kernel: OsKernel) {
		maxYOffset = kernel.screen.maxYOffset;
		positionY = maxYOffset
	}

	$: initApp(context);
	$: initContext(macos);

	onMount(()=>{
		subscribe(context.appID,`container-${context.appID}`,{
			onPositionChanged: function (x: number, y: number): void {
				moveApplication(x, y);
			},
			onOpenApplication: function (x:number,y:number): void {
				show = true;
				zIndex = $activeApplication.size + 1
				moveApplication(x,y)
			},
			onCloseApplication: function (): void {
				show = false;
			},
			onMaximize: function (width: number, height: number, x: number, y: number): void {
				maximize(width, height, x, y);
			},
			onMinimize: function (width: number, height: number): void {
				minimize(width, height);
			},
			onStatusbarSelected: function (menu: OptionsMenu): void {
				maximizeApplication(context)
			}
		})
		return ()=>{
			unsubscribe(context.appID,`container-${context.appID}`)
		}
	})

</script>
{#if show}
	<div
		id={context.appID}
		bind:this={app}
		in:fadeIn
		out:fadeOut
		class="backdrop-blur-[500px] bg-white/40 dark:bg-gray-900 dark:bg-opacity-40 absolute shadow-2xl rounded-md"
		style="width: {$width}px;height:{$height}px; left:{positionX}px; top:{positionY}px; z-index:{zIndex};"
	>
		<slot  width={$width} height={$height}/>
	</div>
{/if}