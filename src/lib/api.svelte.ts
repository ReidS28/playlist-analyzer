import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import type {
	Page,
	TrackItem,
	PlaylistedTrack,
	SimplifiedPlaylist,
} from "@spotify/web-api-ts-sdk";

// Stops API from working
//(SpotifyApi as any)["rootUrl"] = "/api/v1/";

const sp_sdk = SpotifyApi.withUserAuthorization(
	import.meta.env.VITE_SPOTIFY_CLIENT_ID,
	import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
	["playlist-read-private", "playlist-read-collaborative"],
);

export async function getUserPlaylists(): Promise<SimplifiedPlaylist[]> {
	const CACHE_KEY = "spotify_user_playlists";

	try {
		const cachedPlaylists = localStorage.getItem(CACHE_KEY);
		if (cachedPlaylists) {
			return JSON.parse(cachedPlaylists);
		}

		const playlists = await sp_sdk.makeRequest<Page<SimplifiedPlaylist>>(
			"GET",
			"me/playlists",
		);

		localStorage.setItem(CACHE_KEY, JSON.stringify(playlists.items));

		return playlists.items;
	} catch (error) {
		console.error("Failed to fetch playlists:", error);
		throw error;
	}
}

export async function getPlaylistItems(
	playlistId: string,
	length: number = 100,
) {
	console.log("Getting playlist items...");
	try {
		const allItems: PlaylistedTrack[] = [];
		let numItems = 0;

		while (numItems < length) {
			const n = Math.min(100, length - numItems);

			const response = await sp_sdk.makeRequest<Page<PlaylistedTrack>>(
				"GET",
				`playlists/${playlistId}/items?offset=${numItems}&limit=${n}`,
			);

			if (!response.items || response.items.length === 0) {
				break;
			}

			allItems.push(...response.items);
			numItems += response.items.length;
		}

		return allItems;
	} catch (error) {
		console.error("Failed to fetch playlist tracks:", error);
		throw error;
	}
}

export async function logOut() {
	try {
		sp_sdk.logOut();
	} catch (error) {
		console.error("Failed to Log out:", error);
		throw error;
	}
}
