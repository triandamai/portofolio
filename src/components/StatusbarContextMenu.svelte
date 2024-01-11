<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let doc: HTMLElement | null;

	let isShow: boolean = false;
	let offsetx: number = 0;
	let offsety: number = 40;

	export let menus: Array<{
		name: string;
		type: 'divider' | 'button' | 'link';
		path: string
	}> = [
		{
			name: 'About',
			type: 'button',
			path: ''
		},
		{
			name: '',
			type: 'divider',
			path: ''
		},
		{
			name: 'Lock Screen',
			type: 'link',
			path: '/lock'
		},
		{
			name: 'Log Out',
			type: 'button',
			path: ''
		}
	];

	onMount(() => {
		if (browser) {
			doc = document.getElementById('menu_status_bar');
		}
	});

	function clickOutside(element: HTMLElement, callbackFunction: (x: number, y: number) => void) {
		function onClick(event: MouseEvent | PointerEvent | null) {
			const y = event?.offsetY ?? 0;
			if (y > 40) {
				if (
					element &&
					!element.contains(event?.target as Node) &&
					!event?.defaultPrevented
				) {
					callbackFunction(event?.offsetX ?? 0, event?.offsetY ?? 40);
				}
			}
		}

		document.body.addEventListener('click', onClick);

		return {
			update(newCallbackFunction: () => void) {
				callbackFunction = newCallbackFunction;
			},
			destroy() {
				document.body.removeEventListener('click', onClick);
			}
		};
	}

	export function toggle(x: number, y: number) {
		isShow = true;
		offsetx = x;
		offsety = y;
	}

	$: if (isShow) {
		doc?.classList.remove('hidden');
	} else {
		doc?.classList.add('hidden');
	}
</script>

<div
	id="menu_status_bar"
	style="left: {offsetx}px; top: {offsety}px; z-index:999;"
	class="fixed hidden container backdrop-blur-lg bg-gray-400 rounded-md mx-2 mt-4 w-min min-w-max"
	use:clickOutside={() => {
		isShow = false
	}}
>
	<div class=" text-sm z-999" aria-labelledby="dropdownDefaultButton">
		{#each menus as menu}
				{#if menu.type === 'button'}
					<button
						class="menu-item"
						on:click={() => doc?.classList.add('hidden')}>{menu.name}</button
					>
				{:else if menu.type === 'link'}
					<button
						class="menu-item"
						on:click={() => {
								doc?.classList.add('hidden')
								goto(menu.path)
							}
						}>{menu.name}</button
					>
				{:else if menu.type === 'divider'}
					<div class="divider" style="height: 1px;" />
				{/if}
		{/each}
	</div>
</div>
<style lang="scss">
  .container {
    // Initial invisible border
    --additional-box-shadow: 0 0 0 0 white;

    min-width: 16rem;
    width: max-content;

    padding: 0.5rem;

    position: absolute;

    user-select: none;

    border-radius: 0.5rem;

    box-shadow: hsla(0, 0%, 0%, 0.3) 0px 0px 11px 0px, var(--additional-box-shadow);
  }

  .menu-item {
    --alpha: 1;

    display: flex;
    justify-content: flex-start;

    width: 100%;

    padding: 0.2rem 0.4rem;
    margin: 0.1rem;

    letter-spacing: 0.4px;
    font-weight: 500 !important;
    font-size: 0.9rem !important;

    border-radius: 0.3rem;

    transition: none;

    color: hsla(var(--system-color-dark-hsl), var(--alpha));

    &:disabled {
      --alpha: 0.5;
    }

    &:not(:disabled) {
      &:hover,
      &:focus-visible {
        background-color: #2d8de8;
        color: #ffffff;
        font-weight: 500 !important;
      }
    }
  }

  .divider {
    width: 100%;
    height: 0.2px;

    background-color: hsla(var(--system-color-dark-hsl), 0.3);

    margin: 2px 0;
  }
</style>
