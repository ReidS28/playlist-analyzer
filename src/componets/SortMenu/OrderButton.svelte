<script lang="ts">
	import type { Snippet } from "svelte";
	import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

	import type { MouseEventHandler } from "svelte/elements";
	import type { OrderedTrackList } from "../../lib/orderedTrackList.svelte";

	interface Props {
		sortOrder: string;
		tracks: OrderedTrackList;
		class?: string;
		children?: Snippet | undefined;
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
	class="inline-flex items-center gap-1.5 relative isolate overflow-hidden bg-sp-dark-grey px-3 py-1 rounded-full order-button before:content-[''] before:absolute before:inset-0 before:bg-sp-green/40 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200 before:-z-10 {className}"
	class:selected={tracks?.getOrderBase() == sortOrder}
>
	{@render children?.()}

	{#if tracks?.getOrderBase() == sortOrder}
		{@const icon = tracks?.getOrderReversed() ? faArrowDown : faArrowUp}

		<svg
			viewBox="0 0 {icon.icon[0]} {icon.icon[1]}"
			class="w-3 h-3 fill-current shrink-0"
		>
			<path d={icon.icon[4]} />
		</svg>
	{/if}
</button>
