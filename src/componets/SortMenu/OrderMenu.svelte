<script lang="ts">
	import type { OrderedTrackList } from "../../lib/orderedTrackList.svelte";
	import OrderButton from "./OrderButton.svelte";

	let { tracks }: { tracks: OrderedTrackList } = $props();
</script>

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
</div>
