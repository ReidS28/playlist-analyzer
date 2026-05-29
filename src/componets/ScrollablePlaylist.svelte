<script lang="ts">
	import { getPlaylistItems } from "../lib/api.svelte";
	import { formatDurationMs } from "../lib/helper.svelte";
	import type { ActionReturn } from "svelte/action";
	import TrackBar from "./TrackBar.svelte";
	import SortingMenu from "./SortMenu/SortMenu.svelte";
	import { OrderedTrackList } from "../lib/orderedTrackList.svelte";
	let { data, class: className } = $props();

	let tracksPromise = $derived.by(() => {
		if (!data?.id) return null;
		return getPlaylistItems(data.id, data.items.total);
	});
	//$inspect(tracksPromise);

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

	$inspect(tracks.arrangedTracks);
</script>

<div
	class="flex flex-col gap-1 bg-[#212121] rounded-3xl border-6 border-sp-green w-full h-full overflow-x-hidden overflow-y-auto scrollbar-thumb-sp-green {className}"
>
	<div class="flex flex-col">
		<div class="flex flex-row p-2 gap-2 h-40 w-full shrink-0 bg-red-500-">
			<img
				class="h-full w-auto aspect-square rounded-2xl"
				src={data?.images?.[0]?.url || ""}
				alt="Album Cover"
			/>
			<div class="flex flex-col h-full w-full bg-teal-500-">
				<div
					class="w-full grow text-5xl primaryText overflow-hidden break-all line-clamp-3 bg-orange-500-"
				>
					{data?.name || ""}
				</div>
				<span class="secondaryText">{data?.items?.total || ""} tracks</span>
				<span class="secondaryText"
					>{formatDurationMs(playlistDurationMs, true)}</span
				>
			</div>
		</div>
		<SortingMenu tracks={tracks}></SortingMenu>
		<!-- Make Componet -->
	</div>
	<ul class="flex flex-col gap-1 p-1 w-full h-full *:shrink-0 *:w-full *:h-20">
		{#if tracks.arrangedTracks}
			{#each tracks.arrangedTracks as track}
				<TrackBar data={track}></TrackBar>
			{/each}
		{:else}
			<p>Loading tracks...</p>
		{/if}
	</ul>
</div>
