<script lang="ts">
	import { format } from 'date-fns';
	import { createIntervalStore } from '../../../store/interval.store';

	export let textColor:string='text-gray-900 dark:text-white'
	const time = createIntervalStore(1000);
</script>

<div style:margin="0 0.5rem" class="text-sm font-sf-regular place-self-center truncate {textColor}">
	{format($time, 'EEE MMM dd')}&nbsp; {format($time, 'h:mm aa')}
</div>
