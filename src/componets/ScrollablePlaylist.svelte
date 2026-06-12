<script lang="ts">
	import { onMount } from "svelte";
	import { flip } from "svelte/animate";

	import { OrderedTrackList } from "../lib/orderedTrackList.svelte";

	import { getPlaylistItems } from "../lib/api.svelte";
	import { formatDurationMs } from "../lib/helper.svelte";

	import TrackBar from "./TrackBar.svelte";
	import OrderMenu from "./SortMenu/OrderMenu.svelte";

	let { data, class: className } = $props();

	let navbarShrunk = $state(false);
	let scrollContainer: HTMLDivElement | undefined = undefined;
	let observerTarget: HTMLDivElement | undefined = undefined;

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				navbarShrunk = !entry.isIntersecting;
			},
			{
				root: scrollContainer,
				threshold: 0,
			},
		);

		if (observerTarget) observer.observe(observerTarget);

		return () => observer.disconnect();
	});

	let lastScrollY = $state(0);
	let currentScrollY = $state(0);
	let scrollVelocity = $state(0);
	$effect(() => {
		const value = lastScrollY - currentScrollY;
		lastScrollY = currentScrollY;
		scrollVelocity = value;
	});

	let tracksPromise = $derived.by(() => {
		if (!data?.id) return null;
		return getPlaylistItems(data.id, data.items.total);
	});

	// Sum of track lengths
	let playlistDurationMs = $state(0);
	$effect(() => {
		if (tracksPromise) {
			tracksPromise.then((tracks) => {
				playlistDurationMs = tracks.reduce(
					(sum, track) => sum + (track.item.duration_ms || 0),
					0,
				);
			});
		}
	});

	let tracks = new OrderedTrackList(() => tracksPromise);
</script>

<div
	bind:this={scrollContainer}
	onscroll={(e: Event) => {
		const target = e.currentTarget as HTMLDivElement;
		currentScrollY = target.scrollTop;
	}}
	class="flex flex-col gap-0 bg-sp-dark-grey rounded-3xl border-6 border-sp-green w-full h-full relative overflow-x-hidden overflow-y-auto [overflow-anchor:none] scrollbar-thumb-sp-green {className}"
>
	<div
		bind:this={observerTarget}
		class="absolute top-0 h-5 w-0 pointer-events-none"
	></div>
	<div class="flex flex-col sticky z-1 top-0 h-fit">
		<div
			class="flex flex-row p-2 gap-2 min-h-20 w-full shrink overflow-hidden transition-all ease-in-out bg-sp-dark-grey bg-red-500-"
			class:h-40={!navbarShrunk}
			class:duration-150={!navbarShrunk}
			class:h-20={navbarShrunk}
			class:duration-500={navbarShrunk}
		>
			<img
				class="h-full w-auto aspect-square transition-all"
				class:rounded-2xl={!navbarShrunk}
				class:duration-150={!navbarShrunk}
				class:rounded-md={navbarShrunk}
				class:duration-500={navbarShrunk}
				src={data?.images?.[0]?.url || ""}
				alt="Album Cover"
			/>
			<div class="flex flex-col h-full w-full bg-teal-500-">
				<div
					class="w-full grow text-5xl primaryText overflow-hidden break-all line-clamp-3 bg-orange-500-"
				>
					{data?.name || ""}
				</div>
				<div
					class="flex flex-col overflow-hidden transition-all ease-in-out"
					class:opacity-100={!navbarShrunk}
					class:max-h-12={!navbarShrunk}
					class:duration-150={!navbarShrunk}
					class:opacity-0={navbarShrunk}
					class:max-h-0={navbarShrunk}
					class:duration-500={navbarShrunk}
					class:pointer-events-none={navbarShrunk}
				>
					<span class="secondaryText">{data?.items?.total || ""} tracks</span>
					<span class="secondaryText"
						>{formatDurationMs(playlistDurationMs, true)}</span
					>
				</div>
			</div>
		</div>
		<OrderMenu
			{tracks}
			{navbarShrunk}
			{scrollVelocity}
		></OrderMenu>
	</div>
	<ul class="flex flex-col gap-1 p-1 w-full h-full">
		{#if tracks.arrangedTracks}
			{#each tracks.arrangedTracks as track (track.item.id)}
				{@const displayKeyBase = tracks.getTraitBase()}
				{@const displayKey =
					displayKeyBase === "advanced"
						? tracks.getTraitBase(
								tracks.currentOrder.replace("advanced.", "").slice(1, -1),
							)
						: displayKeyBase}
				<div
					class="*:shrink-0 *:w-full *:h-20"
					animate:flip={{ duration: 500 }}
				>
					<TrackBar
						data={track}
						{displayKey}
					></TrackBar>
				</div>
			{/each}
		{:else}
			<p>Loading tracks...</p>
		{/if}
	</ul>
</div>
