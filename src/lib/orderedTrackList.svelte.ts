import type { SimplifiedPlaylist, PlaylistedTrack } from "@spotify/web-api-ts-sdk"
import { getPlaylistItems } from "./api.svelte";

export class OrderedTrackList {
    readonly tracks: Promise<PlaylistedTrack[]>;
    
    public arrangedTracks: PlaylistedTrack[] = [];

    public constructor(tracks: Promise<PlaylistedTrack[]>) {
        this.tracks = tracks;
        
        // Optionally trigger the initial load right away
        this.resetOrder();
    }

    public async resetOrder() {
        try {
            const actualTracks = await this.tracks;
            this.arrangedTracks = [...actualTracks];
        } catch (error) {
            console.error("Failed to reset track order:", error);
        }
    }

    public async sort() {
        if (this.arrangedTracks.length === 0) {
            await this.resetOrder();
        }

        this.arrangedTracks = [...this.arrangedTracks].sort((a, b) => {
            return (a.track?.name || "").localeCompare(b.track?.name || "");
        });
    }
}