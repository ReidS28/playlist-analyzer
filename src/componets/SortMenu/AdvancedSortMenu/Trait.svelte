<script lang="ts">
	import type { TraitObj } from "../../../lib/constants.svelte";

	interface Props {
		trait?: TraitObj | undefined;
		class?: string;
	}

	let { trait, class: className }: Props = $props();

	let validTrait: boolean = $derived(trait?.traitKey === undefined);
</script>

<div class={className}>
	<div
		class="flex flex-row w-full h-6 p-1 items-center justify-center border-[1.5px] rounded truncate shrink-0 {validTrait
			? 'border-sp-light-grey bg-sp-grey border-dashed'
			: 'border-sp-green bg-sp-green/20'}"
	>
		{#if validTrait}
			Select a trait
		{:else}
			{trait?.traitName}
		{/if}
	</div>
</div>
