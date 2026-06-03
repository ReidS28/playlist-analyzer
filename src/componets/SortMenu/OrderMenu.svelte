<script lang="ts">
	import type { OrderedTrackList } from "../../lib/orderedTrackList.svelte";
	import OrderButton from "./OrderButton.svelte";

	let { tracks }: { tracks: OrderedTrackList } = $props();
</script>

<div
	class="flex flex-row p-1 gap-1 w-full h-10 bg-sp-black shrink-0 overflow-x-scroll scrollbar-none"
>
	<OrderButton
		selected={tracks.currentOrder === "custom"}
		onclick={() => {
			tracks?.resetOrder();
		}}
	>
		Custom
	</OrderButton>

	<OrderButton
		selected={tracks.currentOrder === "name"}
		onclick={() => {
			tracks?.sortName();
		}}
	>
		Name
	</OrderButton>

	<OrderButton
		selected={tracks.currentOrder === "artist"}
		onclick={() => {
			tracks?.sortArtistName();
		}}
	>
		Artist
	</OrderButton>

	<OrderButton
		selected={tracks.currentOrder === "length"}
		onclick={() => {
			tracks?.sortLength();
		}}
	>
		Length
	</OrderButton>

	<OrderButton
		selected={tracks.currentOrder === "dateAdded"}
		onclick={() => {
			tracks?.sortDateAdded();
		}}
	>
		Date Added
	</OrderButton>
</div>
