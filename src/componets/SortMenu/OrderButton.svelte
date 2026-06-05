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
	class="inline-flex items-center gap-1.5 relative isolate shrink-0 overflow-hidden bg-sp-dark-grey px-3 py-1 rounded-full {tracks?.getOrderBase() ===
	sortOrder
		? 'bg-sp-green'
		: 'bg-sp-dark-grey hover:bg-sp-green/40'} {className}"
>
	{@render children?.()}

	{#if tracks?.getOrderBase() == sortOrder}
		{@const icon = tracks?.getOrderReversed() ? faArrowDown : faArrowUp}
		{@const paths = Array.isArray(icon.icon[4]) ? icon.icon[4] : [icon.icon[4]]}

		<svg
			viewBox="0 0 {icon.icon[0]} {icon.icon[1]}"
			class="w-3 h-3 fill-current shrink-0"
		>
			{#each paths as pathData}
				<path d={pathData} />
			{/each}
		</svg>
	{/if}
</button>
