<script lang="ts">
	import { fadeIn, fadeOut } from '$lib/utils/fade';
	import { clickOnNoElementId } from '$lib/utils/clickOnNoElementId';
	import { createEventDispatcher } from 'svelte';
	import type { OsKernel } from '$lib/core/type';

	import ButtonBase from '../dock/ButtonBase.svelte';

	const dispatcher = createEventDispatcher();
	let isShow: boolean = false;

	export let macos: OsKernel;

	export function show() {
		if (!isShow) {
			isShow = true;
		}
	}

	export function displayed() {
		return isShow;
	}

	export function hide() {
		isShow = false;
	}
</script>

{#if isShow}
	<div
		use:clickOnNoElementId={{
			callback: () => {
				dispatcher('clickOutside', () => {
					hide();
				});
			}
		}}
		class="main-layout"
	>
		<div
			in:fadeIn
			out:fadeOut
			class="h-screen w-screen backdrop-blur-[100px] bg-white/10 place-content-between"
		>
			<div class="w-screen flex flex-row place-content-center py-3 px-1" style="height: 6vh;">
				<div
					class="bg-white outline-gray-400 outline-0.5 w-1/4 flex flex-row place-content-center p-1 rounded-md bg-opacity-10 px-4"
				>
					<svg
						class="w-4 h-4 text-white place-self-center"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 20"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
						/>
					</svg>
					<input
						id="input_launchpad"
						class="mx-1 place-self-center focus:outline-none placeholder-white bg-white bg-opacity-0 text-sm font-sf-light text-white"
						placeholder="Search"
					/>
				</div>
			</div>
			<div class="w-screen max-h-min flex flex-row place-content-center">
				<div
					class="flex flex-row flex-wrap place-content-start overflow-y-hidden"
					style="height: 80vh; width: 70%;"
				>
					{#each macos.applications as app}
						{#if app.appID !== 'about'}
							<ButtonBase
								id={app.appID}
								on:click={() => {
									dispatcher('click', app);
								}}
								class="dock-button flex flex-col place-self-center"
							>
								<img
									id={`image-${app.appID}`}
									class="app-icon h-[100px] w-[100px] m-4"
									src="/app-icons/{app.appID}/256.png"
									alt=""
								/>
								<p id={`name-${app.appID}`} class="text-white font-sf-light">{app.name}</p>
							</ButtonBase>
						{/if}
					{/each}
				</div>
			</div>
			<div class="w-screen flex flex-row place-content-center" style="height: 10vh;">
				<span class="rounded-full h-2 w-2 bg-white m-1" />
				<span class="rounded-full h-2 w-2 bg-white/10 m-1" />
				<span class="rounded-full h-2 w-2 bg-white/10 m-1" />
			</div>
		</div>
	</div>
{/if}

<style>
	.main-layout {
		position: fixed;
		background-image: url($lib/walpaper/big-sur-7.jpg);
		background-repeat: no-repeat;
		background-size: cover;
		background-color: #949494;
		z-index: 10;
	}
</style>
