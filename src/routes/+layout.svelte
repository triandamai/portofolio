<script lang="ts">
	import { browser } from '$app/environment';
	import { theme } from '$lib/kernel/kernel';
	import '../app.css';
	import './boot';
	theme.subscribe((value) => {
		if (browser) {
			if (value === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	});
</script>

<slot />
