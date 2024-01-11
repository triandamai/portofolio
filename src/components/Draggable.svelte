<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { browser } from '$app/environment';

	let parent: HTMLDivElement;
	let dispatcher = createEventDispatcher();
	export let moving: boolean = false;
	export let xtop: number = 300;
	export let yleft: number = 100;
	export let oldY: number = 0;

	onMount(() => {
		if (browser) {
			console.log(yleft)
		}
	});

	function dragMe(node: HTMLElement) {
		console.log(node)
		window.addEventListener('mousemove', (e) => {
			if (moving && e.offsetX > 1) {
				if (e.pageY < oldY) {
					//top
					if (xtop > 30 && e.clientY > 30) {
						// left += e.movementX;
						// top += e.movementY;
						dispatcher('move', {
							top: e.movementY,
							left: e.movementX
						});
					}
				} else {
					//bottom
					// left += e.movementX;
					// top += e.movementY;
					dispatcher('move', {
						top: e.movementY,
						left: e.movementX
					});
				}
				// oldY = e.pageY;
				dispatcher('y', {
					y: e.pageY
				});
			}
		});

		window.addEventListener('mouseup', () => {
			dispatcher('stop', {});
		});
	}
</script>

<div id="draggable" bind:this={parent} use:dragMe>
	<div class="cursor-default w-screen h-screen">
		<slot />
	</div>
</div>
