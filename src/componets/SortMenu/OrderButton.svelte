<script lang="ts">
	import type { MouseEventHandler } from "svelte/elements";
	import type { OrderedTrackList } from "../../lib/orderedTrackList.svelte";
	import type { Snippet } from "svelte";

	interface Props {
		sortOrder: string,
		tracks: OrderedTrackList,
		class?: string,
		children?: Snippet | undefined,
	}
	let {
		sortOrder = "custom",
		tracks,
		class: className = "",
		children = undefined,
	}: Props = $props();
</script>

<button
	type="button"
	onclick={() => tracks.sort(sortOrder)}
	class="relative isolate overflow-hidden bg-sp-dark-grey px-3 py-1 rounded-full order-button before:content-[''] before:absolute before:inset-0 before:bg-sp-green/40 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200 before:-z-10 {className}"
	class:selected = {tracks?.currentOrder == sortOrder}
>
	{@render children?.()}
</button>
