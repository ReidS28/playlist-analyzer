<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		onclick?: () => void;
		selected?: boolean;
        class?: string 
		children: Snippet;
	}

	let { onclick = () => {}, selected = false, class: className, children }: Props = $props();
</script>

<button
	type="button"
	{onclick}
	class="h-full aspect-square shrink-0 rounded-sm items-center {selected? "bg-sp-green" : "hover:bg-sp-green/40 bg-sp-med-dark-grey"} {className}"
>
	{@render children()}
</button>
