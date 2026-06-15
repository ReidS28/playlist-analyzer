<script lang="ts">
	import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
	import { slide } from "svelte/transition";

	import type { OrderedTrackList } from "../../lib/orderedTrackList.svelte";
	import {
		ARTIST_TRAIT,
		BLANK_TRAIT,
		NAME_TRAIT,
		ALBUM_TRAIT,
		LENGTH_TRAIT,
		DATE_ADDED_TRAIT,
		type orderComponentObj,
		type GroupObj,
		type SortObj,
		type TraitObj,
	} from "../../lib/constants.svelte";

	import OrderButton from "./OrderButton.svelte";
	import AdvancedSortMenu from "./AdvancedSortMenu/AdvancedSortMenu.svelte";
	import { AdvancedOrderState } from "../../lib/advancedOrderState.svelte";

	interface Props {
		tracks: OrderedTrackList;
		navbarShrunk: boolean;
		scrollVelocity: number;
	}
	let { tracks, navbarShrunk, scrollVelocity }: Props = $props();

	const icon = faEllipsis;
	const paths = Array.isArray(icon.icon[4]) ? icon.icon[4] : [icon.icon[4]];

	// TODO: Have this start closed
	let menuOpen = $state(true);
	let advancedOrderState = new AdvancedOrderState([
		AdvancedOrderState.createItem("sort", ARTIST_TRAIT),
		AdvancedOrderState.createItem("group", ALBUM_TRAIT),
		AdvancedOrderState.createItem("group", NAME_TRAIT),
		AdvancedOrderState.createItem("group", LENGTH_TRAIT),
		AdvancedOrderState.createItem("sort", DATE_ADDED_TRAIT),
		AdvancedOrderState.createItem("sort", NAME_TRAIT),
	]);

	$effect(() => {
		if (scrollVelocity < -15) {
			menuOpen = false;
		}
	});
</script>

<div class="">
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
			sortOrder="artist,name"
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

		<!-- TODO: Make Advanced Menu Button stay on screen when screen too small -->
		<button
			type="button"
			onclick={() => {
				menuOpen = !menuOpen;
				if (!navbarShrunk) {
				}
			}}
			class="ml-auto px-3 rounded-full {tracks?.getTraitBase() == 'advanced'
				? 'bg-sp-green'
				: 'hover:bg-sp-green/40 bg-sp-dark-grey'}"
			aria-label="Advanced Order Menu"
		>
			<svg
				viewBox="0 0 {icon.icon[0]} {icon.icon[1]}"
				class="w-fit h-full fill-current shrink-0"
			>
				{#each paths as pathData}
					<path d={pathData} />
				{/each}
			</svg>
		</button>
	</div>
	{#if menuOpen}
		<AdvancedSortMenu {tracks} orderState={advancedOrderState}></AdvancedSortMenu>
	{/if}
</div>
