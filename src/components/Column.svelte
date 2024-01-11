<script lang="ts">
	export let arrangement:
		| 'justify-normal'
		| 'justify-start'
		| 'justify-end'
		| 'justify-between'
		| 'justify-around';
</script>

<div class={`flex flex-col ${arrangement}`}>
	<slot />
</div>
