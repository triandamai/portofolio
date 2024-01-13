<script lang="ts">
	import placeholder from '$lib/image/user.png';
	import { createIntervalStore } from '../store/interval.store';
	import { format } from 'date-fns';
	import Wifi from './SVG/system/wifi/Wifi.svelte';
	import Battery from './SVG/system/battery/Battery.svelte';
	import { goto } from '$app/navigation';
	import {fly} from 'svelte/transition';

	const time = createIntervalStore(1000);

	let showInput: boolean = false;
</script>
<svelte:window
	on:contextmenu|preventDefault={(e)=>{

	}}
	on:keydown={(e)=>{
		if(e.key === "Enter"){
			if(showInput){
				goto("/desktop")
			}else {
				showInput=true
			}
		}
	}}
	on:click={()=>{

	}}
/>
<div
	in:fly={{ x: -200, duration: 300, delay: 1000 }}
	out:fly={{ x: 200, duration: 300 }}
	class="main-layout w-screen h-screen flex flex-row place-content-center backdrop-blur-sm">
	<div class="fixed w-screen flex flex-row place-content-end px-2 py-2">
		<Battery />
		<Wifi />
	</div>
	<div class="h-screen py-10 w-1/3 flex flex-col">
		<div class="h-2/3">
			<h4 class="text-center text-white text-2xl font-medium text-opacity-40">{format($time, 'EEE MMM dd')}
				&nbsp; {format($time, 'h:mm aa')}</h4>
			<h1 class="text-center text-white text-6xl font-sf-bold text-opacity-80">09.10</h1>
		</div>
		<div class="h-1/4 w-full flex flex-col place-content-end">
			<img src={placeholder} class="place-self-center bg-white rounded-full p-3" alt="">
			<div class="w-full flex flex-row mt-2 mb-2 place-content-center">
				{#if showInput}
					<input type="password" placeholder="Enter password"
								 class="focus:outline-none placeholder-white text-xs font-sf-light w-min place-self-center rounded-full px-2 py-1 bg-white bg-opacity-30 text-white text-opacity-90" />
				{:else}
					<h6 class="text-center text-white text-md font-bold font-sf-bold">Trian Damai</h6>
				{/if}
			</div>
			<h6
				on:click={()=>{
					showInput = true
				}}
				class="text-center text-white text-xs font-medium opacity-80 font-sf-light"
			>
				Touch ID or Enter Password
			</h6>
		</div>
	</div>
</div>

<style>
    .main-layout {
        position: fixed;
        background-image: url($lib/walpaper/big-sur-7.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        background-color: #949494;
    }
</style>