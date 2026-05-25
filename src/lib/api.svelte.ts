import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import type { Page, PlaylistedTrack } from '@spotify/web-api-ts-sdk';

const sp_sdk = SpotifyApi.withUserAuthorization(
	import.meta.env.VITE_SPOTIFY_CLIENT_ID,
	import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
	["playlist-read-private", "playlist-read-collaborative"],
);

export async function getUserPlaylists() {
	try {
		const playlists = await sp_sdk.currentUser.playlists.playlists();
		return playlists.items;
	} catch (error) {
		console.error("Failed to fetch playlists:", error);
		throw error;
	}
}

export async function getPlaylistItems(playlistId: string) {
	try {
		//const response = await sp_sdk.playlists.getPlaylistItems(playlistId); // Used depricated API (/tracks)
		const response = await sp_sdk.makeRequest<Page<PlaylistedTrack>>(
			"GET",
			`playlists/${playlistId}/items`,
		);
		return response.items;
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
