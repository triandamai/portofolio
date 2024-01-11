<script lang="ts">
	import { onMount } from 'svelte';

	export let top: number;
	export let left: number;
	export let moving: boolean = false;
	export let width: number;
	export let height: number;
	export let container_name = '';
	let app: HTMLDivElement;

	export function move(top: number, left: number) {
		if (moving) {
			app.style.left = `${left}px`;
			app.style.top = `${top}px`;
		}
	}

	$: move(top, left);

	onMount(() => {
		app.style.left = `${left}px`;
		app.style.top = `${top}px`;
	});
</script>
<div
	id={container_name}
	bind:this={app}
	class="draggable dialog cursor-default outline-1 outline-gray-400"
	style="width: {width}px; height: {height}px"
>
	<slot />
</div>


<style lang="scss">
    .draggable {
        user-select: none;
        position: absolute;
    }
    .dialog {
      --elevation: 0px 2.7px 10.4px rgba(0, 0, 0, 0.124), 0px 6.5px 25px rgba(0, 0, 0, 0.178),
      0px 12.3px 47.1px rgba(0, 0, 0, 0.22), 0px 21.9px 84px rgba(0, 0, 0, 0.262),
      0px 40.9px 157.1px rgba(0, 0, 0, 0.316), 0px 98px 376px rgba(0, 0, 0, 0.44);

      background: hsla(var(--system-color-light-hsl), 0.6);
      backdrop-filter: blur(20px);

      will-change: transform;
      border-radius: 1rem;
      box-shadow: var(--elevation);

      &.dark {
        // border-radius: inherit;
        box-shadow: var(--elevation), inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
        0 0 0 1px hsla(var(--system-color-light-hsl), 0.5);
      }
    }
</style>