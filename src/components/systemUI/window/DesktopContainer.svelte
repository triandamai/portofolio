<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Application, ApplicationState, OsKernel } from '$lib/manifest/application.manifest';
	import { fadeIn, fadeOut } from '$lib/utils/fade';
	import { tweened } from 'svelte/motion';
	import { sineInOut } from 'svelte/easing';

	export let activeApplication: ApplicationState | null = null;
	export let applicationContext: Application;
	export let applicationsState: Array<ApplicationState> = [];

	const width = tweened(0, {
		duration: 200,
		easing: sineInOut
	});
	const height = tweened(0, {
		duration: 200,
		easing: sineInOut
	});
	let maxYOffset: number = 100;

	export let kernel: OsKernel;

	let show: boolean = false;
	let app: HTMLDivElement;
	let dispatcher = createEventDispatcher();

	export function move(state: ApplicationState | null) {
		if (state === null) return;
		if (state.context.appID !== applicationContext.appID) return;
		if (!app) return;
		width.set(state.width);
		height.set(state.height);
		if (state.size === 'min') {

			app.style.left = `${state.x}px`;
			app.style.top = `${state.y}px`;
		} else {
			app.style.left = `0px`;
			app.style.top = `${maxYOffset}px`;
		}
	}

	function detectWindow(data: Map<string, ApplicationState>) {
		let findApp = data.has(applicationContext.appID);
		if (findApp) {
			let findApp = data.get(applicationContext.appID);
			if (findApp) {
				show = findApp.state === 'open';
			}
		} else {
			show = false;
		}
	}

	function initApp(app: Application) {
		width.set(app.component.width);
		height.set(app.component.height);
	}

	function initContext(kernel: OsKernel) {
		maxYOffset = kernel.screen.maxYOffset;
	}

	$: move(activeApplication);
	$: initApp(applicationContext);
	$: initContext(kernel);
	$: detectWindow(applicationsState);

</script>
{#if show}
	<div
		id={applicationContext.appID}
		bind:this={app}
		in:fadeIn
		out:fadeOut
		class="backdrop-blur-[500px] bg-white/40 absolute shadow-2xl rounded-md"
		style="width: {$width}px;height:{$height}px; left:10px; top:28px; z-index:1;"
	>
		<slot />
	</div>
{/if}