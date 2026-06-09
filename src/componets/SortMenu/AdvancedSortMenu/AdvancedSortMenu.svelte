<script lang="ts">
	import { slide } from "svelte/transition";
	import { untrack } from "svelte";

	import type { OrderedTrackList } from "../../../lib/orderedTrackList.svelte";
	import AdvancedSortButtonSquare from "./AdvancedSortButtonSquare.svelte";
	import SortingGroup from "./Group.svelte";
	import Sort from "./Sort.svelte";
	import Trait from "./Trait.svelte";
	import Group from "./Group.svelte";
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
	} from "../../../lib/constants.svelte";

	interface Props {
		tracks: OrderedTrackList;
	}
	let { tracks }: Props = $props();

	let selectedOrder: {
		id: number;
		type: string;
		orderComponent: orderComponentObj;
	}[] = $state(
		[
			{ id: 1, type: "group", orderComponent: { trait: ARTIST_TRAIT } },
			{ id: 2, type: "sort", orderComponent: { trait: BLANK_TRAIT } },
			{ id: 3, type: "sort", orderComponent: { trait: NAME_TRAIT } },
		].map((item) => {
			const updatedOrder = {
				...item.orderComponent,
				reversed: false,
			};

			if (item.type === "group") {
				return {
					...item,
					orderComponent: {
						...updatedOrder,
						groupBy: "firstLetter" as const,
					},
				};
			}

			return {
				...item,
				orderComponent: updatedOrder,
			};
		}),
	);
	let selectedOrderActiveId: number = $state(-1);

	$effect(() => {
		const advancedKey = getAdvancedOrderKey();
		untrack(() => {
			if (tracks.getTraitBase() === "advanced") {
				tracks.order(advancedKey);
			}
		});
	});

	function moveTraitUp() {
		const index = selectedOrder.findIndex(
			(item) => item.id === selectedOrderActiveId,
		);
		if (index > 0) {
			const temp = selectedOrder[index];
			selectedOrder[index] = selectedOrder[index - 1];
			selectedOrder[index - 1] = temp;
		}
	}

	function moveTraitDown() {
		const index = selectedOrder.findIndex(
			(item) => item.id === selectedOrderActiveId,
		);
		if (index !== -1 && index < selectedOrder.length - 1) {
			const temp = selectedOrder[index];
			selectedOrder[index] = selectedOrder[index + 1];
			selectedOrder[index + 1] = temp;
		}
	}

	function getAdvancedOrderKey() {
		const orderKeySegments = selectedOrder
			.filter((item) => item.orderComponent.trait.traitKey !== undefined)
			.map((item) => {
				let segment = "";

				if (item.type === "group-") {
					segment = `group.[${item.orderComponent.trait.traitKey}]`;
				} else {
					segment = item.orderComponent.trait.traitKey
						? `${item.orderComponent.trait.traitKey}`
						: "default";
				}

				return item.orderComponent.reversed ? `${segment}.reversed` : segment;
			});

		return `advanced.[${orderKeySegments.join(",")}]`;
	}
</script>

<div
	transition:slide={{ duration: 150 }}
	class="flex flex-row w-full h-fit p-1 gap-1 bg-sp-grey"
>
	<div
		class="flex flex-col w-5/10 h-50 rounded-lg overflow-hidden shrink-0 bg-sp-dark-grey"
	>
		<div
			class="flex flex-col gap-1 w-full h-full p-1 overflow-x-hidden overflow-y-auto scrollbar-thumb-sp-light-grey bg-sp-dark-grey"
		>
			{#each selectedOrder as item}
				<button
					type="button"
					onclick={() => (selectedOrderActiveId = item.id)}
					class="relative w-full text-left cursor-pointer block"
				>
					{#if item.type === "group"}
						<Group bind:group={item.orderComponent as GroupObj} />
					{:else}
						<Sort bind:sort={item.orderComponent as SortObj} />
					{/if}
					<div
						class="absolute inset-0 pointer-events-none rounded-sm {selectedOrderActiveId ===
						item.id
							? 'bg-sp-med-light-grey/26'
							: ''}"
					></div>
				</button>
			{/each}
		</div>
		<div class="flex flex-row gap-1 w-full h-12 p-1 mt-auto bg-sp-black">
			<AdvancedSortButtonSquare>+</AdvancedSortButtonSquare>
			<AdvancedSortButtonSquare>-</AdvancedSortButtonSquare>
			<AdvancedSortButtonSquare onclick={moveTraitUp}
				>⮝</AdvancedSortButtonSquare
			>
			<AdvancedSortButtonSquare onclick={moveTraitDown}
				>⮟</AdvancedSortButtonSquare
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
				<Trait traitKey={"name"}></Trait>
				<Trait traitKey={"artist"}></Trait>
				<Trait traitKey={"length"}></Trait>
				<Trait traitKey={"date added"}></Trait>
				<Trait traitKey={"eeeeeee"}></Trait>
				<Trait traitKey={"eeeeee"}></Trait>
				<Trait traitKey={"eeeeeeee"}></Trait>
				<Trait traitKey={"eeeeeeeeeee"}></Trait>
				<Trait traitKey={"eeeeee"}></Trait>
				<Trait traitKey={"eeeeeeeee"}></Trait>
				<Trait traitKey={"eeeeeee"}></Trait>
				<Trait traitKey={"ee"}></Trait>
			</div>
		</div>
	</div>
</div>
