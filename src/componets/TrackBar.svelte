<script lang="ts">
	import type { PlaylistedTrack } from "@spotify/web-api-ts-sdk";

	interface Props {
        data: PlaylistedTrack | undefined; 
        class?: string;          
    }
	let { data, class: className = "" }: Props = $props();
</script>

<div class="flex items-center gap-3 bg-[#303030] rounded-md p-1 {className}">
	<img
		class="h-full rounded-lg"
		src={data?.item?.album?.images[2]?.url}
		alt="Album Cover"
	/>
	<div class="flex flex-col w-full h-full">
		<span class="text-xl primaryText">{data?.item?.name || ""}</span>
		<span class="text-xl secondaryText">{data?.item?.artists[0]?.name || ""}</span>
	</div>
</div>
