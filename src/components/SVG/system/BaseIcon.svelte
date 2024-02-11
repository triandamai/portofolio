<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatcher = createEventDispatcher();
	let btn:HTMLDivElement
	function getPosition(){
		const position = btn.getBoundingClientRect()
		dispatcher("click",{
			x:position.x,
			y: 30
		})
		console.log()
	}

</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	bind:this={btn}
	{...$$props}
	on:click={()=>{
		getPosition()
	}}
>
	<slot/>
</div>
