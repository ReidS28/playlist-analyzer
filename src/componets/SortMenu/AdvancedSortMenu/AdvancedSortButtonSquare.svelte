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

	function handleClick() {
		if (menu) {
			menuOpen = !menuOpen;
		}
		onclick?.();
	}
</script>

<div class="relative inline-block h-full {className}">
	{#if menu && menuOpen}
		<div
			class="fixed inset-0 cursor-default"
			onclick={() => (menuOpen = false)}
			role="presentation"
		></div>

		<div class="absolute bottom-full mb-1">
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
