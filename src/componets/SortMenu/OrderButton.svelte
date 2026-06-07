<script lang="ts">
	import type { Snippet } from "svelte";
	import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

	import type { MouseEventHandler } from "svelte/elements";
	import type { OrderedTrackList } from "../../lib/orderedTrackList.svelte";
	import FaIcon from "../ui/FaIcon.svelte";
	import { icon } from "@fortawesome/fontawesome-svg-core";

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

	let selected = $derived(
		tracks?.getTraitBase() == tracks?.getTraitBase(sortOrder),
	);
</script>

<button
	type="button"
	onclick={() => tracks.order(sortOrder)}
	class="inline-flex items-center gap-1.5 relative isolate shrink-0 overflow-hidden bg-sp-dark-grey px-3 py-1 rounded-full {selected
		? 'bg-sp-green'
		: 'bg-sp-dark-grey hover:bg-sp-green/40'} {className}"
>
	{@render children?.()}

	{#if selected}
		<FaIcon
			icon={tracks?.getTraitReversed() ? faArrowDown : faArrowUp}
			class="w-3 h-3"
		></FaIcon>
	{/if}
</button>
