<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import CloseSVG from '../SVG/traffic-lights/CloseSVG.svelte';
	import MinimizeSVG from '../SVG/traffic-lights/MinimizeSVG.svelte';
	import StretchSVG from '../SVG/traffic-lights/StretchSVG.svelte';

	let dispatcher = createEventDispatcher();
</script>

<div class="min-w-max max-w-min px-2 py-2 container flex flex-row">
	<button class="close-light p-0.5" on:click={() => dispatcher('close', {})}>
		<CloseSVG />
	</button>
	<button class="minimize-light p-1" on:click={()=> dispatcher('minimize', {})}>
		<MinimizeSVG />
	</button>
	<button class="stretch-light" on:click={()=> dispatcher('maximize', {})}>
		<StretchSVG />
	</button>
</div>
<style lang="scss">

  .container {
    --button-size: 0.8rem;
    display: grid;
    grid-template-columns: repeat(3, var(--button-size));
    align-items: center;
    gap: 0.6rem;

    &.unfocused button {
      --bgcolor: #b6b6b7;
      --border-color: hsla(240, 3%, 11%, 0.5);
    }

    :global(svg) {
      opacity: 0;
    }

    &:hover {
      button {
        transform: scale(1);
      }

      :global(svg) {
        opacity: 1;
      }
    }
  }
	button{
		height: var(--button-size);
    width: var(--button-size);

		border-radius: 50%;

		background-color: var(--bgcolor);
		box-shadow: 0 0 0 0.5px var(--border-color);

		transition: transform 100ms ease-in;
	}

  .close-light {
    --bgcolor: #ff5f56;
    --border-color: #e0443e;
  }

  .stretch-light {
    --bgcolor: #27c93f;
    --border-color: #1aab29;

    :global(svg) {
      transform: rotate(90deg);
    }
  }

  .minimize-light {
    --bgcolor: #ffbd2e;
    --border-color: #dea123;
  }
</style>