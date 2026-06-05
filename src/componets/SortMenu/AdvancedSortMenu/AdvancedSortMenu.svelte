<script lang="ts">
	import { slide } from "svelte/transition";
	
	import type { OrderedTrackList } from "../../../lib/orderedTrackList.svelte";
	import AdvancedSortButtonSquare from "./AdvancedSortButtonSquare.svelte";
	import SortingGroup from "./Group.svelte";
	import Sort from "./Sort.svelte";
	import Trait from "./Trait.svelte";

	interface Props {
		tracks: OrderedTrackList;
	}
	let { tracks }: Props = $props();
</script>

<div
	transition:slide={{ duration: 150 }}
	class="flex flex-row w-full h-fit p-1 gap-1 bg-sp-grey"
>
	<div
		class="flex flex-col w-5/10 h-50 rounded-lg overflow-hidden shrink-0 bg-sp-dark-grey"
	>
		<div
			class="flex flex-col gap-1 w-full h-full p-1 overflow-x-hidden overflow-y-auto scrollbar-thumb-sp-light-grey bg-sp-dark-grey"
		>
			<Sort>Sort</Sort>
			<Sort>Sort</Sort>
			<Sort>Sort</Sort>
		</div>
		<div class="flex flex-row gap-1 w-full h-12 p-1 mt-auto bg-sp-black">
			<AdvancedSortButtonSquare>+</AdvancedSortButtonSquare>
			<AdvancedSortButtonSquare>-</AdvancedSortButtonSquare>
			<AdvancedSortButtonSquare>⮝</AdvancedSortButtonSquare>
			<AdvancedSortButtonSquare>⮟</AdvancedSortButtonSquare>
			<AdvancedSortButtonSquare class="ml-auto">✔</AdvancedSortButtonSquare>
		</div>
	</div>
	<div class="flex flex-col gap-1 w-full bg-red-500">
		<span class="text-2xl primaryText">Traits</span>
		<div class="flex flex-row flex-wrap gap-1 w-full h-fit bg-orange-500">
			<Trait sortOrder={"eeeeee"}></Trait>
			<Trait sortOrder={"eeeeeeee"}></Trait>
			<Trait sortOrder={"eeeeeeeeeee"}></Trait>
			<Trait sortOrder={"eeeeeeeee"}></Trait>
			<Trait sortOrder={"eeeeeee"}></Trait>
			<Trait sortOrder={"eeeeee"}></Trait>
			<Trait sortOrder={"eeeeeeee"}></Trait>
			<Trait sortOrder={"eeeeeeeeeee"}></Trait>
			<Trait sortOrder={"eeeeeeeee"}></Trait>
			<Trait sortOrder={"eeeeeee"}></Trait>
			<Trait sortOrder={"eeeeee"}></Trait>
			<Trait sortOrder={"ee"}></Trait>
		</div>
	</div>
</div>
