<script lang="ts">
	import '../app.css';
	import { run, loadSystemConfig } from './boot';
	loadSystemConfig();
	run();

</script>
<slot />