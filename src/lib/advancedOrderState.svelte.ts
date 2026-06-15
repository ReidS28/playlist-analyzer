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

export class AdvancedOrderState {
	public order: {
		id: UUID;
		type: "group" | "sort";
		orderComponent: orderComponentObj;
	}[] = $state([
		AdvancedOrderState.createItem("sort", ARTIST_TRAIT),
		AdvancedOrderState.createItem("group", ALBUM_TRAIT),
		AdvancedOrderState.createItem("group", NAME_TRAIT),
		AdvancedOrderState.createItem("group", LENGTH_TRAIT),
		AdvancedOrderState.createItem("sort", DATE_ADDED_TRAIT),
		AdvancedOrderState.createItem("sort", NAME_TRAIT),
	]);
	public activeId: UUID = $state("0-0-0-0-0");

	public constructor(
		initalOrder: {
			id: UUID;
			type: "group" | "sort";
			orderComponent: orderComponentObj;
		}[] = [],
	) {
        this.order = initalOrder;
    }

	public static createItem(
		type: "group" | "sort",
		trait: TraitObj = BLANK_TRAIT,
	): {
		id: UUID;
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

	public addItem(
		item: {
			id: UUID;
			type: "group" | "sort";
			orderComponent: orderComponentObj;
		},
		afterId: UUID = this.activeId,
		selectOnAdd: boolean = true,
	) {
		let index = this.findIndexFromId(afterId) + 1;
		if (index === 0) {
			index = this.order.length;
		} else {
		}
		this.order.splice(index, 0, item);
		if (selectOnAdd) {
			const nextIndex = Math.min(index, this.order.length - 1);
			if (nextIndex >= 0) {
				this.activeId = this.order[nextIndex].id;
			}
		}
	}

	public removeItemm(
		id: `${string}-${string}-${string}-${string}-${string}` = this.activeId,
		selectNextItem: boolean = true,
	) {
		const index = this.findIndexFromId(id);
		this.order.splice(index, 1);
		if (selectNextItem) {
			const nextIndex = Math.min(index, this.order.length - 1);
			if (nextIndex >= 0) {
				this.activeId = this.order[nextIndex].id;
			}
		}
	}

	public moveItemUp(
		id: `${string}-${string}-${string}-${string}-${string}` = this.activeId,
	) {
		const index = this.findIndexFromId(id);
		if (index > 0) {
			const temp = this.order[index];
			this.order[index] = this.order[index - 1];
			this.order[index - 1] = temp;
		}
	}

	public moveItemDown(
		id: `${string}-${string}-${string}-${string}-${string}` = this.activeId,
	) {
		const index = this.findIndexFromId(id);
		if (index !== -1 && index < this.order.length - 1) {
			const temp = this.order[index];
			this.order[index] = this.order[index + 1];
			this.order[index + 1] = temp;
		}
	}

	public setItemTrait(
		trait: TraitObj,
		id: `${string}-${string}-${string}-${string}-${string}` = this.activeId,
	) {
		const index = this.findIndexFromId(id);
		if (index >= 0) {
			this.order[index].orderComponent.trait = trait;
		}
	}

	public findIndexFromId(id: UUID = this.activeId) {
		return this.order.findIndex((item) => item.id === id);
	}

	public getAdvancedOrderKey() {
		const orderKeySegments = this.order
			.filter((item) => item.orderComponent.trait.traitKey !== undefined) // Remove blank traits
			.map((item) => {
				let segment = "";
				const key =
					item.orderComponent.trait.traitKey +
					(item.orderComponent.reversed ? ".reversed" : "");

				if (item.type === "group") {
					segment = `group.[${key}]`;
				} else {
					segment = key;
				}

				return segment;
			});

		return `advanced.[${orderKeySegments.join(",")}]`;
	}
}
