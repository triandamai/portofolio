<script lang="ts">
	import { computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { type ComponentType, createEventDispatcher, onMount } from 'svelte';

	export let componentOrString: ComponentType | string;
	export let parent: HTMLElement | SVGSVGElement;

	const dispatch = createEventDispatcher();

	let root: HTMLElement;

	onMount(async () => {
		if (typeof componentOrString !== 'string') {
			new componentOrString({
				target: root
			});
		}

		const { x, y } = await computePosition(parent, root, {
			placement: 'top',
			middleware: [offset(6), shift({ padding: 5 }), flip({})]
		});

		root.style.left = `${x}px`;
		root.style.top = `${y}px`;

		root.addEventListener('mouseenter', () => dispatch('mouseenter'));
		root.addEventListener('mouseleave', () => dispatch('mouseleave'));
	});
</script>

<div bind:this={root} class="tooltip backdrop-blur-sm bg-white/30 rounded-sm px-2 py-0">
	{#if typeof componentOrString === 'string'}
		{componentOrString}
	{/if}
</div>

<style>
	.tooltip {
		width: max-content;
		position: absolute;
	}
</style>