<script lang="ts">
	import { slide } from "svelte/transition";
	
	import type { OrderedTrackList } from "../../../lib/orderedTrackList.svelte";
	import AdvancedSortButtonSquare from "./AdvancedSortButtonSquare.svelte";
	import SortingGroup from "./Group.svelte";
	import Sort from "./Sort.svelte";
	import Group from "./Group.svelte";

	interface Props {
		tracks: OrderedTrackList;
	}
	let { tracks }: Props = $props();
</script>

<div
	transition:slide={{ duration: 150 }}
	class="flex flex-col w-full h-fit p-1 bg-sp-grey"
>
	<div
		class="flex flex-col w-5/10 h-50 rounded-lg overflow-hidden bg-sp-dark-grey"
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
</div>
