import type {
	PlaylistedTrack,
} from "@spotify/web-api-ts-sdk";

export class OrderedTrackList {
	private getTracks: () => Promise<PlaylistedTrack[]> | null;

	public arrangedTracks: PlaylistedTrack[] = $state([]);

	public constructor(getTracks: () => Promise<PlaylistedTrack[]> | null) {
		this.getTracks = getTracks;

		$effect(() => {
			this.resetOrder();
		});
	}

	public async resetOrder() {
		try {
			const tracks = this.getTracks();
			if (!tracks) return;
			const actualTracks = await tracks;
			this.arrangedTracks = [...actualTracks];
		} catch (error) {
			console.error("Failed to reset track order:", error);
		}
	}

	public async sort(compare: (a: PlaylistedTrack, b: PlaylistedTrack) => number) {
        console.log("sorting tracks");
        if (!this.arrangedTracks) {
            console.log("no tracks");
            return;
        } 
		if (this.arrangedTracks.length === 0) {
			await this.resetOrder();
		}

		this.arrangedTracks = this.arrangedTracks.sort(compare);
	}

    public compareName(a: PlaylistedTrack, b: PlaylistedTrack): number{
        return (a.item.name || "").localeCompare(b.item.name || "");
    }

    public compareArtistName(a: PlaylistedTrack, b: PlaylistedTrack): number{
        return (a.item.artists[0].name || "").localeCompare(b.item.artists[0].name || "");
    }

    public compareLength(a: PlaylistedTrack, b: PlaylistedTrack): number{
        return (a.item?.duration_ms || 0) - (b.item?.duration_ms || 0);
    }

    public async sortName() {
        return this.sort(this.compareName)
    }

    public async sortArtistName() {
        return this.sort(this.compareArtistName)
    }

    public async sortLength() {
        return this.sort(this.compareLength)
    }

}
