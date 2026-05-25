<script lang="ts">
	import { onMount } from "svelte";
	import { getPlaylistItems } from "../lib/api.svelte";
	import TrackBar from "./TrackBar.svelte";
	import type { PlaylistedTrack } from "@spotify/web-api-ts-sdk";
	let { data, class: className, children } = $props();

	let tracksPromise = $derived.by(async () => {
		if (!data?.id) return [];
		return await getPlaylistItems(data.id);
	});
</script>

<ul
	class="flex flex-col gap-1 p-1 bg-gray-900 rounded-xl border border-gray-200 w-full h-full overflow-y-auto scrollbar-thumb-sp-green *:shrink-0 *:w-full *:h-20 {className}"
>
	<!-- {@render children?.()} -->
	{#await tracksPromise}
		<p>Loading tracks...</p>
	{:then tracks}
		{#each tracks as track}
			<TrackBar
				title={track.track.name}
				artist="b"
			></TrackBar>
		{/each}
	{/await}
</ul>
