<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let type:string = ''
	export let name:string=''
	let dispatcher = createEventDispatcher();
</script>
{#if type === 'button'}
	<button
		on:click={()=>{dispatcher("itemClick",name)}}
		class="font-sf-regular text-start text-gray-900 text-sm pr-16 pl-2 rounded-md py-0.5 hover:bg-blue-500 hover:text-white">
		{name ?? ''}
	</button>
{:else }
	<div class="h-[0.05rem] w-full bg-gray-500 rounded-md my-0.5" />
{/if}