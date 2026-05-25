<script lang="ts">
	import { getPlaylistItems } from "../lib/api.svelte";
	import TrackBar from "./TrackBar.svelte";
	let { data, class: className, children } = $props();

	let tracksPromise = $derived.by(() => {
		if (!data?.id) return null;
		return getPlaylistItems(data.id);
	});
	$inspect(tracksPromise);
</script>

<ul
	class="flex flex-col gap-1 p-1 bg-gray-900 rounded-xl border border-gray-200 w-full h-full overflow-y-auto scrollbar-thumb-sp-green *:shrink-0 *:w-full *:h-20 {className}"
>
	{#await tracksPromise}
		<p>Loading tracks...</p>
	{:then tracks}
		{#each tracks as track}
			<TrackBar
				title={track.item.name}
				artist={track.item.artists[0].name}
				cover_src={track.item.album.images[2].url}
			></TrackBar>
		{/each}
	{/await}
</ul>
