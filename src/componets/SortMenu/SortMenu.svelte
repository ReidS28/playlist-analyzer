<script lang="ts">
	import type { OrderedTrackList } from "../../lib/orderedTrackList.svelte";
	import OrderButton from "./OrderButton.svelte";

	let { tracks }: { tracks: OrderedTrackList } = $props();
</script>

<div
	class="flex flex-row p-1 gap-1 w-full h-10 bg-sp-black shrink-0 overflow-x-scroll scrollbar-none"
>
	<OrderButton onclick={() => tracks?.resetOrder() || (() => {})}
		>Custom</OrderButton
	>
	<OrderButton onclick={() => tracks?.sortName() || (() => {})}
		>Name</OrderButton
	>
	<OrderButton onclick={() => tracks?.sortArtistName() || (() => {})}
		>Artist</OrderButton
	>
	<OrderButton onclick={() => tracks?.sortLength() || (() => {})}
		>Length</OrderButton
	>
</div>
