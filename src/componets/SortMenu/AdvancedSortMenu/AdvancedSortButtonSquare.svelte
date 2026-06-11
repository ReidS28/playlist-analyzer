<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		onclick?: () => void;
		selected?: boolean;
		menu?: Snippet;
		class?: string;
		children: Snippet;
	}

	let {
		onclick = () => {},
		selected = false,
		menu,
		class: className,
		children,
	}: Props = $props();

	let menuOpen = $state(false);
	let containerRef = $state<HTMLDivElement | null>(null);
	let menuRef = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!menuOpen) return;

		// Close menu click
		const handleDocumentClick = (event: MouseEvent) => {
			const target = event.target as Node;

            if (menuRef && menuRef.contains(target)) {
                menuOpen = false;
                return;
            }

            if (containerRef && !containerRef.contains(target)) {
                menuOpen = false;
            }
		};

		document.addEventListener("click", handleDocumentClick);

		return () => {
			document.removeEventListener("click", handleDocumentClick);
		};
	});
</script>

<div
	bind:this={containerRef}
	class="relative inline-block h-full {className}"
>
	{#if menu && menuOpen}
		<div bind:this={menuRef} class="absolute bottom-full mb-1 z-20">
			{@render menu()}
		</div>
	{/if}

	<button
		type="button"
		onclick={() => {
			if (menu) {
				menuOpen = !menuOpen;
			}
			onclick?.();
		}}
		class="h-full aspect-square shrink-0 rounded-sm items-center {selected
			? 'bg-sp-green'
			: 'bg-sp-med-dark-grey hover:bg-sp-green/40'}"
	>
		{@render children()}
	</button>
</div>
