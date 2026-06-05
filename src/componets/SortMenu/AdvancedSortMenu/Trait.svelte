<script lang="ts">
	interface Props {
		sortOrder?: string | undefined;
		class?: string;
	}

	let { sortOrder, class: className }: Props = $props();

    let validOrder: boolean = $derived(!sortOrder)
</script>

<div class={className}>
	<div
		class="flex flex-row w-full h-6 p-1 items-center justify-center border-[1.5px] rounded truncate shrink-0 {validOrder
			? 'border-sp-light-grey bg-sp-grey border-dashed'
			: 'border-sp-green bg-sp-green/20'}"
	>
		{#if validOrder}
			Select a trait
		{:else}
			{sortOrder}
		{/if}
	</div>
</div>
