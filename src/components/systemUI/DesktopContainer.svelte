<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let y: number;
	export let x: number;
	export let current_application_active = '';
	export let application_id = '';
	export let width: number;
	export let height: number;

	let app: HTMLDivElement;
	let dispatcher = createEventDispatcher();

	export function move(top: number, left: number) {
		if (current_application_active === application_id) {
			app.style.left = `${left}px`;
			app.style.top = `${top}px`;
		}
	}

	$: move(y, x);

	onMount(() => {
		app.style.left = `${x}px`;
		app.style.top = `${y}px`;
		app.addEventListener('mousedown', () => {
			dispatcher('down', {});
		});
	});
</script>
<div
	id={application_id}
	bind:this={app}
	class="backdrop-blur-[500px] bg-white/40 absolute shadow-2xl rounded-md"
	style="width: {width}px; height: {height}px;"
>
	<slot />
</div>