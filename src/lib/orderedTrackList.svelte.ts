import type { PlaylistedTrack, TrackItem } from "@spotify/web-api-ts-sdk";

type TrackTraitSelector = (
	track: PlaylistedTrack,
) => string | number | undefined | null;

type TrackTrait = {
	selector: TrackTraitSelector;
	reverse?: boolean;
};

export class OrderedTrackList {
	private getTracks: () => Promise<PlaylistedTrack[]> | null;

	public currentOrder = $state("custom");
	public arrangedTracks: PlaylistedTrack[] = $state([]);

	public constructor(getTracks: () => Promise<PlaylistedTrack[]> | null) {
		this.getTracks = getTracks;

		$inspect(this.currentOrder);

		$effect(() => {
			this.resetOrder();
		});
	}

	public getOrderBase(sortOrder = this.currentOrder): string {
		return sortOrder.split(".", 1)[0];
	}

	public getOrderReversed(sortOrder = this.currentOrder): boolean {
		return sortOrder.includes(".reversed");
	}

	public async resetOrder(): Promise<void> {
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

	public async sort(sortOrder = "custom"): Promise<void> {
		let traits: TrackTrait | TrackTrait[] = { selector: (track) => undefined };

		const sortOrderBase = this.getOrderBase(sortOrder);
		const sortOrderReversed = this.getOrderReversed(sortOrder);

		if (this.getOrderBase() == sortOrderBase && !sortOrderReversed) {
			this.arrangedTracks.reverse();
			if (this.getOrderReversed()) {
				this.currentOrder = this.currentOrder.replace(".reversed", "");
			} else {
				this.currentOrder += ".reversed";
			}
			return;
		} else {
			await this.resetOrder();
			if (!this.arrangedTracks || this.arrangedTracks.length === 0) return;
		}

		if (sortOrderBase == "custom") {
			await this.resetOrder();
			if (sortOrderReversed) {
				this.arrangedTracks.reverse();
				this.currentOrder += ".reversed";
			}
			return;
		} else if (sortOrderBase == "name") {
			traits = { selector: this.getName };
		} else if (sortOrderBase == "artist") {
			traits = [{ selector: this.getArtistName }, { selector: this.getName }];
		} else if (sortOrderBase == "length") {
			traits = { selector: this.getLength };
		} else if (sortOrderBase == "dateAdded") {
			traits = { selector: this.getDateAdded };
		}

		if (!Array.isArray(traits)) {
			traits = [traits];
		}

		if (!sortOrderReversed) {
			this.arrangedTracks.sort((a, b) => this.compare(a, b, ...traits));
		} else {
			this.arrangedTracks.sort((a, b) => -this.compare(a, b, ...traits));
		}

		this.currentOrder = sortOrder;
		return;
	}

	public async randomize(): Promise<void> {
		await this.resetOrder();
		for (let i = this.arrangedTracks.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.arrangedTracks[i], this.arrangedTracks[j]] = [
				this.arrangedTracks[j],
				this.arrangedTracks[i],
			];
		}
	}

	public compare = (
		a: PlaylistedTrack,
		b: PlaylistedTrack,
		...traits: TrackTrait[]
	): number => {
		for (const trait of traits) {
			const valA = trait.selector(a);
			const valB = trait.selector(b);

			let result = 0;

			if (typeof valA === "number" || typeof valB === "number") {
				result = ((valA as number) ?? 0) - ((valB as number) ?? 0);
			} else {
				const strA = valA?.toString() ?? "";
				const strB = valB?.toString() ?? "";
				result = strA.localeCompare(strB);
			}

			if (result !== 0) {
				return trait.reverse ? -result : result;
			}
		}

		return 0;
	};

	public getName = (track: PlaylistedTrack): string | undefined => {
		return track?.item?.name;
	};

	public getArtistName = (track: PlaylistedTrack): string | undefined => {
		return track?.item?.artists[0]?.name;
	};

	public getLength = (track: PlaylistedTrack): number | undefined => {
		return track?.item?.duration_ms;
	};

	public getDateAdded = (track: PlaylistedTrack): string | undefined => {
		return track?.added_at;
	};
}
