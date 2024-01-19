<script lang="ts">
	import Cupertino from '../components/framework/Cupertino.svelte';
	import TrafficLight from '../components/systemUI/TrafficLight.svelte';
	import { closeApplication, minimizeApplication, maximizeApplication } from '$lib/kernel/kernel';
	import type { Application, OptionsMenu } from '$lib/kernel/type';
	import { onMount } from 'svelte';
	import { registerReceiver, unregisterReceiver } from '$lib/kernel/application/application';

	export let width: number;
	export let height: number;

	export let context: Application;

	const buttonSize = width / 4;

	type button = {
		operator: '+' | '-' | '=' | '/' | '*' | ',' | '%' | 'ac' | 'btn';
		text: string;
		value: string;
		scale: number;
		color: string;
	};

	const button: Array<Array<button>> = [
		[
			{
				operator: 'ac',
				text: 'AC',
				value: '',
				scale: 1,
				color: 'bg-gray-700'
			},
			{
				operator: '/',
				text: '/',
				value: '',
				scale: 1,
				color: 'bg-gray-700'
			},
			{
				operator: '%',
				text: '%',
				value: '',
				scale: 1,
				color: 'bg-gray-700'
			},
			{
				operator: '/',
				text: '/',
				value: '',
				scale: 1,
				color: 'bg-amber-500'
			}
		],
		[
			{
				operator: 'btn',
				text: '7',
				value: '7',
				scale: 1,
				color: 'bg-gray-400'
			},
			{
				operator: 'btn',
				text: '8',
				value: '8',
				scale: 1,
				color: 'bg-gray-400'
			},
			{
				operator: 'btn',
				text: '9',
				value: '9',
				scale: 1,
				color: 'bg-gray-400'
			},
			{
				operator: '*',
				text: 'x',
				value: '',
				scale: 1,
				color: 'bg-amber-500'
			}
		],
		[
			{
				operator: 'btn',
				text: '4',
				value: '4',
				scale: 1,
				color: 'bg-gray-400'
			},
			{
				operator: 'btn',
				text: '5',
				value: '5',
				scale: 1,
				color: 'bg-gray-400'
			},
			{
				operator: 'btn',
				text: '6',
				value: '6',
				scale: 1,
				color: 'bg-gray-400'
			},
			{
				operator: '-',
				text: '-',
				value: '',
				scale: 1,
				color: 'bg-amber-500'
			}
		],
		[
			{
				operator: 'btn',
				text: '1',
				value: '1',
				scale: 1,
				color: 'bg-gray-400'
			},
			{
				operator: 'btn',
				text: '2',
				value: '2',
				scale: 1,
				color: 'bg-gray-400'
			},
			{
				operator: 'btn',
				text: '3',
				value: '3',
				scale: 1,
				color: 'bg-gray-400'
			},
			{
				operator: '+',
				text: '+',
				value: '',
				scale: 1,
				color: 'bg-amber-500'
			}
		],
		[
			{
				operator: '+',
				text: '0',
				value: '',
				scale: 2,
				color: 'bg-gray-400 rounded-bl-md'
			},
			{
				operator: ',',
				text: ',',
				value: '',
				scale: 1,
				color: 'bg-gray-400'
			},
			{
				operator: '=',
				text: '=',
				value: '',
				scale: 1,
				color: 'bg-amber-500 rounded-br-md'
			}
		]
	];

	function calculateSizeForZeroButton(buttonSize:number,colIndex:number,rowIndex:number):number{
		if(colIndex < button.length-1) return buttonSize

		if(rowIndex == 0){
			return buttonSize + 0.5
		}
		return buttonSize
	}

	onMount(() => {
		registerReceiver(context.appID, {
			onMaximize: function (width: number, height: number, x: number, y: number): void {
				console.log('Function not implemented. maximize');
			},
			onMinimize: function (width: number, height: number): void {
				console.log('Function not implemented. minimize');
			},
			onPositionChanged: function (x: number, y: number): void {
				console.log('Function not implemented. position changed');
			},
			onStatusbarSelected: function (menu: OptionsMenu): void {
				console.log('Function not implemented. status bar selected');
			},
			onOpenApplication: function (): void {
				console.log('Function not implemented. opening');
			},
			onCloseApplication: function (): void {
				console.log('Function not implemented. closing');
			}
		});

		return () => {
			unregisterReceiver(context.appID);
		};
	});
</script>

<Cupertino appWidth={width} appHeight={height} {context}>
	<TrafficLight
		slot="appbar"
		on:close={(e) => closeApplication(context)}
		on:minimize={(e) => minimizeApplication(context)}
	/>
	<div class="h-full w-full overflow-y-scroll flex flex-col">
		<div class="px-4 w-full flex flex-row place-content-end" style="height:50px;">
			<span class="w-full text-end text-4xl text-white dark:text-white">0</span>
		</div>
		<div class="w-full flex flex-col">
			{#each button as btn, index}
				<div class="w-full flex flex-row place-content-center">
					{#each btn as b, rowIdx}
						<button
							style="width: {calculateSizeForZeroButton(buttonSize,index,rowIdx) * b.scale}px; height:{buttonSize - (buttonSize / 5)}px;"
							class="w-10 h-10 text-white  focus:bg-opacity-60 {b.color}">{b.text}</button
						>
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
