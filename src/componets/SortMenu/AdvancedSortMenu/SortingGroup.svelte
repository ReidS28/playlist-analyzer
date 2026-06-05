<script lang="ts">
	import { slide } from "svelte/transition";
	import type { Snippet } from "svelte";

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();

	let expanded = $state(false);
</script>

<div class="flex flex-col bg-red-500-">
	<div class="w-full h-8 rounded-sm p-0.5 gap-1 shrink-0 bg-sp-med-dark-grey">
		<button
			onclick={() => {
				expanded = !expanded;
			}}
			class="bg-sp-grey">{expanded ? "⮝" : "⮟"}</button
		> Group
	</div>
	{#if expanded}
		<div
			transition:slide={{ duration: 150 }}
			class="flex flex-row w-full h-fit bg-orange-500-"
		>
			<div class=" w-4 h-full bg-pink-500-"></div>
			<div class="flex flex-col pt-1 gap-1 w-full h-full bg-teal-500-">
				{@render children?.()}
			</div>
		</div>
	{/if}
</div>
