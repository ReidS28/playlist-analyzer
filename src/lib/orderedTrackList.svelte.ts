import type { PlaylistedTrack, TrackItem } from "@spotify/web-api-ts-sdk";

import {
	ARTIST_TRAIT,
	BLANK_TRAIT,
	NAME_TRAIT,
	ALBUM_TRAIT,
	LENGTH_TRAIT,
	DATE_ADDED_TRAIT,
	type orderComponentObj,
	type GroupObj,
	type SortObj,
	type TraitObj,
} from "./constants.svelte";
import type { UUID } from "crypto";

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
	public arrangedTracks: (PlaylistedTrack | OrderedTrackList)[] = $state([]);
	public item = $state({ id: crypto.randomUUID() });

	public constructor(getTracks: () => Promise<PlaylistedTrack[]> | null) {
		this.getTracks = getTracks;

		$effect(() => {
			this.resetOrder();
		});
	}

	public getTraitBase(traitsKey = this.currentOrder): string {
		return traitsKey.split(",", 1)[0].split(".", 1)[0];
	}

	public getTraitReversed(traitsKey = this.currentOrder): boolean {
		return traitsKey.includes(".reversed");
	}

	public async resetOrder(): Promise<void> {
		try {
			const tracks = this.getTracks();
			if (!tracks) return;
			const actualTracks = await tracks;
			this.arrangedTracks = [...actualTracks];
		} catch (error) {
			console.error("Failed to reset track order:", error);
		}
	}

	public flattenTrackOrder(
		input: (PlaylistedTrack | OrderedTrackList)[] = this.arrangedTracks,
	): PlaylistedTrack[] {
		let output: PlaylistedTrack[] = [];
		for (const element of input) {
			if (element instanceof OrderedTrackList) {
				output.push(...this.flattenTrackOrder(element.arrangedTracks));
			} else {
				output.push(element);
			}
		}
		return output;
	}

	public splitOrderKeyByGroups(
		orderKey: string,
	): { key: string; group: boolean }[] {
		let temp = orderKey;
		let output: { key: string; group: boolean }[] = [];
		while (true) {
			const nextIndex = temp.indexOf("group.[");
			if (nextIndex === -1) {
				output.push({ key: temp, group: false });
				break;
			} else {
				if (nextIndex > 1) {
					output.push({ key: temp.substring(0, nextIndex - 1), group: false });
					temp = temp.substring(nextIndex);
				}
				temp = temp.replace("group.[", "");
				const closingIndex = temp.indexOf("]");
				output.push({ key: temp.substring(0, closingIndex), group: true });
				temp = temp.substring(closingIndex + 2);
			}
		}
		return output;
	}

	public flattenSplitOrderKey(splitKey: { key: string; group: boolean }[]) {
		return splitKey.map((item) => item.key).join(",");
	}

	public async order(orderKey: string = "custom"): Promise<void> {
		if (this.getTraitBase(orderKey) === "advanced") {
			const nextKey = orderKey.replace("advanced.", "").slice(1, -1); // Isolate inside brackets
			const splitKey = this.splitOrderKeyByGroups(nextKey);
			const simpleKey = this.flattenSplitOrderKey(splitKey);
			console.log(`simpleKey: ${simpleKey}`);
			await this.sort(simpleKey);
		} else {
			// Toggle reverse for the first trait if the traits are the same as before and reverse isn't specified
			const firstTraitReversed = this.getTraitReversed(orderKey);
			if (
				orderKey.replaceAll("reversed", "") ===
					this.currentOrder.replaceAll("reversed", "") &&
				!this.getTraitReversed() &&
				!firstTraitReversed
			) {
				const traits = orderKey.split(",");
				if (traits.length > 0 && !traits[0].endsWith(".reversed")) {
					traits[0] += ".reversed";
				}
				orderKey = `${traits.join(",")}`;
			}
			await this.sort(orderKey);
		}
		this.currentOrder = orderKey;
		console.log(`Current Track Order: ${this.currentOrder}`);
	}

	public group(
		sortedOrder: (PlaylistedTrack | OrderedTrackList)[],
		splitKey: { key: string; group: boolean }[],
	) {}

	public async sort(traitsKey = "custom"): Promise<void> {
		const splitTraitsKey = traitsKey.split(",");

		let traits: TrackTrait[] = [];

		for (const traitKey of splitTraitsKey) {
			const traitBase = this.getTraitBase(traitKey);
			const traitReversed = this.getTraitReversed(traitKey);

			if (traitBase == "custom") {
				await this.resetOrder();
				if (traitReversed) {
					this.arrangedTracks.reverse();
				}
				return;
			} else if (traitBase == "name") {
				traits.push({ selector: this.getName, reverse: traitReversed });
			} else if (traitBase == "artist") {
				traits.push({ selector: this.getArtistName, reverse: traitReversed });
			} else if (traitBase == "album") {
				traits.push({ selector: this.getAlbumName, reverse: traitReversed });
			} else if (traitBase == "length") {
				traits.push({ selector: this.getLength, reverse: traitReversed });
			} else if (traitBase == "dateAdded") {
				traits.push({ selector: this.getDateAdded, reverse: traitReversed });
			}
		}

		this.arrangedTracks = this.flattenTrackOrder().sort((a, b) =>
			this.compare(a, b, ...traits),
		);

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

	public getAlbumName = (track: PlaylistedTrack): string | undefined => {
		return track?.item?.album?.name;
	};

	public getLength = (track: PlaylistedTrack): number | undefined => {
		return track?.item?.duration_ms;
	};

	public getDateAdded = (track: PlaylistedTrack): string | undefined => {
		return track?.added_at;
	};
}
