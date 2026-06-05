<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		onclick?: () => void;
        class?: string 
		children: Snippet;
	}

	let { onclick = () => {}, class: className, children }: Props = $props();
</script>

<button
	type="button"
	{onclick}
    class="h-full aspect-square shrink-0 rounded-sm items-center hover:bg-sp-green/40 bg-sp-med-dark-grey {className}"
>
	{@render children()}
</button>
