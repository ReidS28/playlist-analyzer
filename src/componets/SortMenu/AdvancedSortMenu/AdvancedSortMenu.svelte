<script lang="ts">
	import { slide } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { untrack } from "svelte";

	import type { OrderedTrackList } from "../../../lib/orderedTrackList.svelte";
	import AdvancedSortButtonSquare from "./AdvancedSortButtonSquare.svelte";
	import SortingGroup from "./GroupItem.svelte";
	import Sort from "./SortItem.svelte";
	import Trait from "./Trait.svelte";
	import Group from "./GroupItem.svelte";
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
	} from "../../../lib/constants.svelte";
	import type { UUID } from "crypto";

	interface Props {
		tracks: OrderedTrackList;
	}
	let { tracks }: Props = $props();

	const baseTraits = [
		NAME_TRAIT,
		ARTIST_TRAIT,
		ALBUM_TRAIT,
		LENGTH_TRAIT,
		DATE_ADDED_TRAIT,
	];

	function createItem(
		type: "group" | "sort",
		trait: TraitObj,
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

	$effect(() => {
		const advancedKey = getAdvancedOrderKey();
		untrack(() => {
			if (tracks.getTraitBase() === "advanced") {
				tracks.order(advancedKey);
			}
		});
	});

	function getAdvancedOrderKey() {
		const orderKeySegments = tracks.advancedOrder
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
</script>

<div
	transition:slide={{ duration: 150 }}
	class="flex flex-row w-full h-fit p-1 gap-1 bg-sp-grey"
>
	<div
		class="flex flex-col w-5/10 h-fit min-h-30 max-h-50 rounded-lg overflow-hidden shrink-0 bg-sp-dark-grey"
	>
		<div
			class="flex flex-col gap-1 w-full h-full p-1 overflow-x-hidden overflow-y-auto scrollbar-thumb-sp-light-grey"
		>
			{#each tracks.advancedOrder as item (item.id)}
				<button
					type="button"
					animate:flip={{ duration: 200 }}
					onclick={() => (tracks.advancedOrderActiveId = item.id)}
					class="relative w-full text-left cursor-pointer block"
				>
					{#if item.type === "group"}
						<Group bind:group={item.orderComponent as GroupObj} />
					{:else}
						<Sort bind:sort={item.orderComponent as SortObj} />
					{/if}
					<div
						class="absolute inset-0 pointer-events-none rounded-sm {tracks.advancedOrderActiveId ===
						item.id
							? 'bg-sp-med-light-grey/26'
							: ''}"
					></div>
				</button>
			{:else}<div
					class="flex flex-row p-1 gap-2 w-full h-8 items-center justify-center rounded-sm shrink-0 border-[1.5px] border-sp-light-grey bg-sp-grey border-dashed"
				>
					Add a sort or group
				</div>{/each}
		</div>
		<div
			class="flex flex-row gap-1 w-full h-10 shrink-0 p-1 mt-auto bg-sp-black"
		>
			{#snippet addAdvancedOrderItemMenu()}
				<div
					class="flex flex-col w-fit h-fit rounded bg-sp-med-light-grey p-0.75 gap-0.75 *:px-1 *:py-0 *:items-center *:text-left *:text-lg *:bg-sp-grey *:hover:bg-sp-green/40 *:rounded"
				>
					<button
						onclick={() => {
							tracks.addAdvancedOrderItem(
								tracks.createAdvancedOrderItem("sort"),
							);
						}}
					>
						Sort
					</button>
					<button
						onclick={() => {
							tracks.addAdvancedOrderItem(
								tracks.createAdvancedOrderItem("group"),
							);
						}}
					>
						Group
					</button>
				</div>
			{/snippet}
			<AdvancedSortButtonSquare menu={addAdvancedOrderItemMenu}
				>+</AdvancedSortButtonSquare
			>
			<AdvancedSortButtonSquare
				onclick={() => {
					tracks.removeAdvancedOrderItem();
				}}>-</AdvancedSortButtonSquare
			>
			<AdvancedSortButtonSquare
				onclick={() => {
					tracks.moveAdvancedOrderItemUp();
				}}>⮝</AdvancedSortButtonSquare
			>
			<AdvancedSortButtonSquare
				onclick={() => {
					tracks.moveAdvancedOrderItemDown();
				}}>⮟</AdvancedSortButtonSquare
			>
			<AdvancedSortButtonSquare
				onclick={() => {
					tracks.order(getAdvancedOrderKey());
				}}
				selected={tracks?.getTraitBase() === "advanced"}
				class="ml-auto">✔</AdvancedSortButtonSquare
			>
		</div>
	</div>
	<div class="flex flex-col gap-1 w-full bg-red-500-">
		<div class="flex flex-col p-1 rounded bg-sp-med-dark-grey">
			<span class="text-2xl primaryText">Traits</span>
			<div
				class="flex flex-row flex-wrap *:w-fit gap-1 w-full h-fit bg-orange-500-"
			>
				{#each baseTraits as trait}
					<Trait
						traitSelected={(trait) => {
							if (trait) {
								tracks.setAdvancedOrderItemTrait(trait);
							}
						}}
						{trait}
					/>
				{/each}
			</div>
		</div>
	</div>
</div>
