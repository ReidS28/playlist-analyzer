<script lang="ts">

    interface Props {
        sortOrder?: string | undefined
        class?: string;
    }

    let { sortOrder, class: className }: Props = $props();

</script>

<div class="*:h-6 *:p-1 *:border-[1.5px] *:border-sp-light-grey *:rounded *:items-center *:shrink-0 {className} bg-pink-500">
		{#if sortOrder}
			<div
				class="flex flex-row w-fit border-[1.5px] border-sp-light-grey rounded bg-sp-grey"
			>
				{sortOrder}
			</div>
		{:else}
			<div
				class="flex flex-row w-full justify-center border-[1.5px] border-dashed border-sp-light-grey rounded bg-sp-grey"
			>
				Select a trait
			</div>
		{/if}
	</div>