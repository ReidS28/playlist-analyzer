<script lang="ts">
	import type { PlaylistedTrack } from "@spotify/web-api-ts-sdk";

	import { formatDurationMs, formatIsoToLocal } from "../lib/helper.svelte";

	interface Props {
		data: PlaylistedTrack | undefined;
		currentOrder: String | undefined;
		class?: string;
	}
	let {
		data,
		currentOrder = undefined,
		class: className = "",
	}: Props = $props();

	function getSpecialValue(): String | undefined {
		if (currentOrder == "length") {
			return (formatDurationMs(data?.item?.duration_ms, true) + "" || "");
		} else if (currentOrder == "dateAdded") {
			return (formatIsoToLocal(String(data?.added_at))|| "");
		}
		return undefined;
	}
</script>

<div class="flex items-center gap-3 bg-[#303030] rounded-md p-1 {className}">
	<img
		class="h-full rounded-lg"
		src={data?.item?.album?.images[2]?.url}
		alt="Album Cover"
	/>
	<div class="flex flex-col min-w-0 w-full h-full">
		<span class="text-xl primaryText truncate shrink-0"
			>{data?.item?.name || ""}</span
		>
		<div class="flex w-full h-full">
			<span class="text-xl secondaryText w-full truncate"
				>{data?.item?.artists[0]?.name || ""}</span
			>
			{#if currentOrder && getSpecialValue()}
				<div
					class="mt-auto w-fit h-fit px-1 border-3 border-sp-green/60 rounded-xl bg-sp-green/40"
				>
					<span class="text-xl secondaryText">{getSpecialValue()}</span>
				</div>
			{/if}
		</div>
	</div>
</div>
