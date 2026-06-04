<script lang="ts">
	import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
	import { slide } from "svelte/transition";

	import type { OrderedTrackList } from "../../lib/orderedTrackList.svelte";
	import OrderButton from "./OrderButton.svelte";

	interface Props {
		tracks: OrderedTrackList;
		navbarShrunk: boolean;
		scrollVelocity: number;
	}
	let { tracks, navbarShrunk, scrollVelocity }: Props = $props();

	const icon = faEllipsis;

	//let menuOpen = $derived(!navbarShrunk);
	let menuOpen = $state(true);

	$effect(() => {
		if (scrollVelocity < -15) {
			menuOpen = false;
		}
	});

	$inspect(menuOpen);
</script>

<div class="bg-red-500">
	<div
		class="flex flex-row p-1 gap-1 w-full h-10 bg-sp-black shrink-0 overflow-x-scroll scrollbar-none"
	>
		<OrderButton
			sortOrder="custom"
			{tracks}>Custom</OrderButton
		>

		<OrderButton
			sortOrder="name"
			{tracks}
		>
			Name
		</OrderButton>

		<OrderButton
			sortOrder="artist"
			{tracks}
		>
			Artist
		</OrderButton>

		<OrderButton
			sortOrder="length"
			{tracks}
		>
			Length
		</OrderButton>

		<OrderButton
			sortOrder="dateAdded"
			{tracks}
		>
			Date Added
		</OrderButton>
		<button
			type="button"
			onclick={() => {
				menuOpen = !menuOpen;
				if (!navbarShrunk) {
				}
			}}
			class="ml-auto px-3 bg-sp-dark-grey rounded-full order-button"
			aria-label="Open menu"
		>
			<svg
				viewBox="0 0 {icon.icon[0]} {icon.icon[1]}"
				class="w-fit h-full fill-current shrink-0"
			>
				<path d={icon.icon[4]} />
			</svg>
		</button>
	</div>
	{#if menuOpen}
		<div
			transition:slide={{ duration: 150 }}
			class="flex flex-col w-full h-fit p-2 transition-all duration-150 ease-in-out bg-orange-500"
		>
			<span class="h-20 text-4xl primaryText">{tracks.currentOrder}</span>
		</div>
	{/if}
</div>
