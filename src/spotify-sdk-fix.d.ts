import "@spotify/web-api-ts-sdk";

declare module "@spotify/web-api-ts-sdk" {
	interface PlaylistedTrack<T = TrackItem> {
		item: T;
	}
}
