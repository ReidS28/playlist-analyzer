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

	public advancedOrder: {
		id: `${string}-${string}-${string}-${string}-${string}`;
		type: "group" | "sort";
		orderComponent: orderComponentObj;
	}[] = $state([
		this.createAdvancedOrderItem("group", ARTIST_TRAIT),
		this.createAdvancedOrderItem("group", LENGTH_TRAIT),
		this.createAdvancedOrderItem("sort", BLANK_TRAIT),
		this.createAdvancedOrderItem("sort", NAME_TRAIT),
		this.createAdvancedOrderItem("sort", NAME_TRAIT),
	]);
	public advancedOrderActiveId: `${string}-${string}-${string}-${string}-${string}` =
		$state("0-0-0-0-0");

	public constructor(getTracks: () => Promise<PlaylistedTrack[]> | null) {
		this.getTracks = getTracks;

		//$inspect(this.currentOrder);

		$effect(() => {
			this.resetOrder();
		});
	}

	public createAdvancedOrderItem(
		type: "group" | "sort",
		trait: TraitObj,
	): {
		id: `${string}-${string}-${string}-${string}-${string}`;
		type: "group" | "sort";
		orderComponent: orderComponentObj;
	} {
		const isGroup = type === "group";
		return {
			id: crypto.randomUUID(),
			type,
			orderComponent: {
				trait,
				reversed: false,
				...(isGroup && { groupBy: "firstLetter" as const }),
			},
		};
	}

	public findAdvancedOrderIndexFromId(
		id: `${string}-${string}-${string}-${string}-${string}` = this
			.advancedOrderActiveId,
	) {
		return this.advancedOrder.findIndex((item) => item.id === id);
	}

	public removeAdvancedOrderItem(
		id: `${string}-${string}-${string}-${string}-${string}` = this
			.advancedOrderActiveId,
		selectNextItem: boolean = true,
	) {
		const index = this.findAdvancedOrderIndexFromId(id);
		this.advancedOrder.splice(index, 1);
		if (selectNextItem) {
			const nextIndex = Math.min(index, this.advancedOrder.length - 1);
			if (nextIndex >= 0) {
				this.advancedOrderActiveId = this.advancedOrder[nextIndex].id;
			}
		}
	}

	public moveAdvancedOrderItemUp(
		id: `${string}-${string}-${string}-${string}-${string}` = this
			.advancedOrderActiveId,
	) {
		const index = this.findAdvancedOrderIndexFromId(id);
		if (index > 0) {
			const temp = this.advancedOrder[index];
			this.advancedOrder[index] = this.advancedOrder[index - 1];
			this.advancedOrder[index - 1] = temp;
		}
	}

	public moveAdvancedOrderItemDown(
		id: `${string}-${string}-${string}-${string}-${string}` = this
			.advancedOrderActiveId,
	) {
		const index = this.findAdvancedOrderIndexFromId(id);
		if (index !== -1 && index < this.advancedOrder.length - 1) {
			const temp = this.advancedOrder[index];
			this.advancedOrder[index] = this.advancedOrder[index + 1];
			this.advancedOrder[index + 1] = temp;
		}
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

	public async order(orderKey: string = "custom"): Promise<void> {
		if (this.getTraitBase(orderKey) == "advanced") {
			const next = orderKey.replace("advanced.", "").slice(1, -1); // Remove Brackets
			//console.log(`next: ${next}`);
			await this.sort(next);
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
			} else if (traitBase == "length") {
				traits.push({ selector: this.getLength, reverse: traitReversed });
			} else if (traitBase == "dateAdded") {
				traits.push({ selector: this.getDateAdded, reverse: traitReversed });
			}
		}

		this.arrangedTracks.sort((a, b) => this.compare(a, b, ...traits));

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
