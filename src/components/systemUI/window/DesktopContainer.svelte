<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { ApplicationState } from '$lib/manifest/application.manifest';

	export let y: number;
	export let x: number;
	export let current_application_active = '';
	export let application_id = '';
	export let width: number;
	export let height: number;

	export let applicationsState: Array<ApplicationState> = [];

	let show: boolean = false;

	let app: HTMLDivElement;
	let dispatcher = createEventDispatcher();

	export function move(top: number, left: number) {
		if (current_application_active === application_id) {
			if (app) {
				app.style.left = `${left}px`;
				app.style.top = `${top}px`;
			}
		}
	}

	function detectWindow(data: Array<ApplicationState>) {
		let findApp = data.find((v => v.context.appID === application_id));
		if (findApp) {
			show = findApp.state === 'open';
			addListener()
		} else {
			show = false;
		}

	}

	function addListener(){
		if(app) {
			app.addEventListener('mousedown', () => {
				dispatcher('down', {});
			});
		}
	}

	$: detectWindow(applicationsState);
	$: move(y, x);

	onMount(() => {
		addListener()
	});
</script>
{#if show}
	<div
		id={application_id}
		bind:this={app}
		class="backdrop-blur-[500px] bg-white/40 absolute shadow-2xl rounded-md"
		style="width: {width}px; height: {height}px; left:30%; top:30%; z-index:1;"
	>
		<slot />
	</div>
{/if}