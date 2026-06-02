import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import type {
	Page,
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

export async function clearCache(): Promise<void> {
	let i = 0;
	while (i < localStorage.length) {
		let key = localStorage.key(i);
		if (key?.startsWith("sp_cache_")) {
			localStorage.removeItem(key);
		} else {
			i++;
		}
	}
}

export async function getUserPlaylists(): Promise<SimplifiedPlaylist[]> {
	const CACHE_KEY = "sp_cache_user_playlists";

	try {
		const cachedData = localStorage.getItem(CACHE_KEY);
		if (cachedData) {
			console.log(`Using cached data from ${CACHE_KEY}`);
			return JSON.parse(cachedData);
		} else {
			console.log(`No Cache for ${CACHE_KEY}`);
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
	const CACHE_KEY = `sp_cache_playlist_${playlistId}_${length}`;
	try {
		const cachedData = localStorage.getItem(CACHE_KEY);

		if (cachedData) {
			console.log(`Using cached data from ${CACHE_KEY}`);
			return JSON.parse(cachedData) as PlaylistedTrack[];
		} else {
			console.log(`No Cache for ${CACHE_KEY}`);
		}

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

		localStorage.setItem(CACHE_KEY, JSON.stringify(allItems));

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
