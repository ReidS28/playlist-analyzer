import type { PlaylistedTrack, TrackItem } from "@spotify/web-api-ts-sdk";

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

		public async sort(sortOrder = "custom") {
			let compare: (
				a: PlaylistedTrack<TrackItem>,
				b: PlaylistedTrack<TrackItem>,
			) => number = (a, b) => 0;

			if (sortOrder == "custom") {
				await this.resetOrder();
				return;
			} else if (sortOrder == "name") {
				compare = this.compareName;
			} else if (sortOrder == "artist") {
				compare = this.compareArtistName;
			} else if (sortOrder == "length") {
				compare = this.compareLength;
			} else if (sortOrder == "dateAdded") {
				compare = this.compareDateAdded;
			}

			await this.resetOrder();
			if (!this.arrangedTracks || this.arrangedTracks.length === 0) return;
			this.arrangedTracks = this.arrangedTracks.sort((a, b) => compare(a, b));

			this.currentOrder = sortOrder;
		}

		public compareName = ((a: PlaylistedTrack, b: PlaylistedTrack): number => {
			return (a?.item.name || "").localeCompare(b?.item.name || "");
		});

		public compareArtistName = ((a: PlaylistedTrack, b: PlaylistedTrack): number => {
			const d = (a?.item.artists[0].name || "").localeCompare(
				b?.item.artists[0].name || "",
			);
			return (d != 0 ? d : this.compareName(a, b));
		});

		public compareLength = ((a: PlaylistedTrack, b: PlaylistedTrack): number => {
			return (a?.item?.duration_ms || 0) - (b?.item?.duration_ms || 0);
		});

		public compareDateAdded = ((a: PlaylistedTrack, b: PlaylistedTrack): number => {
			return (a?.added_at || "").localeCompare(b?.added_at || "");
		});
}
