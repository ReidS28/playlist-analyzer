<script lang="ts">
	import { onMount } from "svelte";
	import { getUserPlaylists, logOut, clearCache } from "./lib/api.svelte";
	import type {
		SimplifiedPlaylist,
		PlaylistedTrack,
	} from "@spotify/web-api-ts-sdk";
	import ScrollablePlaylist from "./componets/ScrollablePlaylist.svelte";

	let playlists = $state<SimplifiedPlaylist[]>([]);
	let playlistDisplay: ScrollablePlaylist | undefined = undefined;

	onMount(async () => {
		playlists = await getUserPlaylists();
	});
</script>

<div class="playlist-container flex items-center justify-center">
	<!-- Replace w/ Better style -->
	<button
		onclick={logOut}
		class="absolute top-4 right-4 px-4 py-2 text-sm font-semibold text-white bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all rounded-full border border-gray-600 cursor-pointer"
	>
		Log Out
	</button>
	<button
		onclick={clearCache}
		class="absolute top-16 right-4 px-4 py-2 text-sm font-semibold text-white bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all rounded-full border border-gray-600 cursor-pointer"
	>
		Clear Cache
	</button>

	<ScrollablePlaylist
		data={playlists[5]}
		class="max-w-xl max-h-[90vh]"
	></ScrollablePlaylist>
</div>
