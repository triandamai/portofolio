<script lang="ts">
	import type { Application } from '$lib/core/framework/application';
	import { SvelteComponent, type ComponentType, onMount } from 'svelte';

	import Cupertino from '../../components/framework/Cupertino.svelte';
	import TrafficLight from '../../components/systemUI/TrafficLight.svelte';
	import Divide from '../../components/SVG/icons/Divide.svelte';
	import Plus from '../../components/SVG/icons/Plus.svelte';
	import Minus from '../../components/SVG/icons/Minus.svelte';
	import Multiply from '../../components/SVG/icons/Multiply.svelte';
	import PlusSlashMinus from '../../components/SVG/icons/PlusSlashMinus.svelte';
	import Equal from '../../components/SVG/icons/Equal.svelte';

	export let width: number;
	export let height: number;

	export let context: Application;

	const buttonSize = width / 4;

	type button = {
		operator: '+' | '-' | '=' | '/' | '-+' | '*' | ',' | '%' | 'ac' | 'btn';
		text: string;
		value: string;
		scale: number;
		color: string;
		component: ComponentType<SvelteComponent> | undefined;
	};

	const button: Array<Array<button>> = [
		[
			{
				operator: 'ac',
				text: 'AC',
				value: '',
				scale: 1,
				color: 'bg-gray-700',
				component: undefined
			},
			{
				operator: '-+',
				text: '/',
				value: '',
				scale: 1,
				color: 'bg-gray-700',
				component: PlusSlashMinus
			},
			{
				operator: '%',
				text: '%',
				value: '',
				scale: 1,
				color: 'bg-gray-700',
				component: undefined
			},
			{
				operator: '/',
				text: '/',
				value: '',
				scale: 1,
				color: 'bg-amber-500',
				component: Divide
			}
		],
		[
			{
				operator: 'btn',
				text: '7',
				value: '7',
				scale: 1,
				color: 'bg-gray-400',
				component: undefined
			},
			{
				operator: 'btn',
				text: '8',
				value: '8',
				scale: 1,
				color: 'bg-gray-400',
				component: undefined
			},
			{
				operator: 'btn',
				text: '9',
				value: '9',
				scale: 1,
				color: 'bg-gray-400',
				component: undefined
			},
			{
				operator: '*',
				text: 'x',
				value: '',
				scale: 1,
				color: 'bg-amber-500',
				component: Multiply
			}
		],
		[
			{
				operator: 'btn',
				text: '4',
				value: '4',
				scale: 1,
				color: 'bg-gray-400',
				component: undefined
			},
			{
				operator: 'btn',
				text: '5',
				value: '5',
				scale: 1,
				color: 'bg-gray-400',
				component: undefined
			},
			{
				operator: 'btn',
				text: '6',
				value: '6',
				scale: 1,
				color: 'bg-gray-400',
				component: undefined
			},
			{
				operator: '-',
				text: '-',
				value: '',
				scale: 1,
				color: 'bg-amber-500',
				component: Minus
			}
		],
		[
			{
				operator: 'btn',
				text: '1',
				value: '1',
				scale: 1,
				color: 'bg-gray-400',
				component: undefined
			},
			{
				operator: 'btn',
				text: '2',
				value: '2',
				scale: 1,
				color: 'bg-gray-400',
				component: undefined
			},
			{
				operator: 'btn',
				text: '3',
				value: '3',
				scale: 1,
				color: 'bg-gray-400',
				component: undefined
			},
			{
				operator: '+',
				text: '+',
				value: '',
				scale: 1,
				color: 'bg-amber-500',
				component: Plus
			}
		],
		[
			{
				operator: 'btn',
				text: '0',
				value: '0',
				scale: 2,
				color: 'bg-gray-400 rounded-bl-md',
				component: undefined
			},
			{
				operator: ',',
				text: ',',
				value: '',
				scale: 1,
				color: 'bg-gray-400',
				component: undefined
			},
			{
				operator: '=',
				text: '=',
				value: '',
				scale: 1,
				color: 'bg-amber-500 rounded-br-md',
				component: Equal
			}
		]
	];

	function calculateSizeForZeroButton(
		buttonSize: number,
		colIndex: number,
		rowIndex: number
	): number {
		if (colIndex < button.length - 1) return buttonSize;

		if (rowIndex == 0) {
			return buttonSize + 0.5;
		}
		return buttonSize;
	}

	onMount(() => {

		return () => {

		};
	});
</script>

<Cupertino
	layout={'basic'}
	appWidth={width}
	appHeight={height}
	context={context}
>
	<div class="h-full w-full overflow-y-scroll flex flex-col">
		<div class="px-4 w-full flex flex-row place-content-end" style="height:50px;">
			<span class="w-full text-end text-4xl text-white dark:text-white">0</span>
		</div>
		<div class="w-full flex flex-col">
			{#each button as btn, index}
				<div class="w-full flex flex-row place-content-center">
					{#each btn as b, rowIdx}
						<button
							style="width: {calculateSizeForZeroButton(buttonSize, index, rowIdx) *
								b.scale}px; height:{buttonSize - buttonSize / 5}px;"
							class="w-10 h-10 text-white font-sf-bold text-md place-content-center flex flex-row focus:bg-opacity-60 {b.color}"
						>
							{#if b.component}
								<svelte:component this={b.component} class="w-7 h-7 place-self-center" />
							{:else}
								<span class="place-self-center">{b.text}</span>
							{/if}
						</button>
						{#if rowIdx < btn.length - 1}
							<div class="w-[1px] h-full bg-gray-900" />
						{/if}
					{/each}
				</div>
				{#if index < button.length - 1}
					<div class="w-full h-[1px] bg-gray-900" />
				{/if}
			{/each}
		</div>
	</div>
</Cupertino>
