<script lang="ts">
	import { getPlaylistItems } from "../lib/api.svelte";
	import { formatDurationMs } from "../lib/helper.svelte";
	import TrackBar from "./TrackBar.svelte";
	let { data, class: className } = $props();

	let tracksPromise = $derived.by(() => {
		if (!data?.id) return null;
		return getPlaylistItems(data.id, data.items.total);
	});
	$inspect(tracksPromise);

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
</script>

<div
	class="flex flex-col gap-1 bg-[#212121] rounded-3xl border-6 border-sp-green w-full h-full overflow-x-hidden overflow-y-auto scrollbar-thumb-sp-green {className}"
>
	<div class="flex flex-col">
		<div class="flex flex-row p-2 gap-2 h-40 w-full shrink-0 bg-red-500">
			{#if data?.images?.[0]?.url}
				<img
					class="h-full w-auto aspect-square rounded-2xl"
					src={data?.images?.[0]?.url || "./assets/covers/Cold Space"}
					alt="Album Cover"
				/>
			{/if}
			<div class="flex flex-col h-full w-full bg-teal-500">
				<div class="w-full grow text-5xl primaryText bg-orange-500">
					{data?.name || "EEE"}
				</div>
				<span class="secondaryText">{data?.items?.total || ""} tracks</span>
				<span class="secondaryText"
					>{formatDurationMs(playlistDurationMs, true)}</span
				>
			</div>
		</div>
		<div class="w-full h-10 bg-sp-black shrink-0">This will be a menue</div>
		<!-- Make Componet -->
	</div>
	<ul
		class="flex flex-col gap-1 p-1 w-full h-full *:shrink-0 *:w-full *:h-20 {className}"
	>
		{#await tracksPromise}
			<p>Loading tracks...</p>
		{:then tracks}
			{#each tracks as track}
				<TrackBar
					title={track?.item?.name || ""}
					artist={track?.item?.artists[0]?.name || ""}
					cover_src={track?.item?.album?.images[2]?.url || ""}
				></TrackBar>
			{/each}
		{/await}
	</ul>
</div>
