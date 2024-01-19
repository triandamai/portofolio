<script lang="ts">
	import { browser } from '$app/environment';
	import { theme } from '$lib/core/system/macos';
	import '../app.css';
	import './boot';

	/*===== LOAD APPLICATION ====*/
	import "../applications/about"
	import "../applications/calculator"
	import "../applications/finder"
	import "../applications/notes"
	/*=========================*/

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
