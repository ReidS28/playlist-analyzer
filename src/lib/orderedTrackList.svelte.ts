import type { PlaylistedTrack } from "@spotify/web-api-ts-sdk";

export class OrderedTrackList {
	private getTracks: () => Promise<PlaylistedTrack[]> | null;

	public currentOrder = $state("custom");
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
			this.currentOrder = "custom";
		} catch (error) {
			console.error("Failed to reset track order:", error);
		}
	}

	public async sort(
		compare: (a: PlaylistedTrack, b: PlaylistedTrack) => number,
	) {
		await this.resetOrder();

		if (!this.arrangedTracks || this.arrangedTracks.length === 0) return;

		this.arrangedTracks = this.arrangedTracks.sort(compare);
	}

	public compareName(a: PlaylistedTrack, b: PlaylistedTrack): number {
		return (a?.item.name || "").localeCompare(b?.item.name || "");
	}

	public compareArtistName(a: PlaylistedTrack, b: PlaylistedTrack): number {
		return (a?.item.artists[0].name || "").localeCompare(
			b?.item.artists[0].name || "",
		);
	}

	public compareLength(a: PlaylistedTrack, b: PlaylistedTrack): number {
		return (a?.item?.duration_ms || 0) - (b?.item?.duration_ms || 0);
	}

	public compareDateAdded(a: PlaylistedTrack, b: PlaylistedTrack): number {
		return (a?.added_at || "").localeCompare(b?.added_at || "");
	}

	public async sortName() {
		await this.sort(this.compareName);
		this.currentOrder = "name";
	}

	public async sortArtistName() {
		await this.sort(this.compareArtistName);
		this.currentOrder = "artist";
	}

	public async sortLength() {
		await this.sort(this.compareLength);
		this.currentOrder = "length";
	}

	public async sortDateAdded() {
		await this.sort(this.compareDateAdded);
		this.currentOrder = "dateAdded";
	}
}
