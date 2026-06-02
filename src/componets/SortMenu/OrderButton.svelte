<script lang="ts">
	import type { MouseEventHandler } from "svelte/elements";

	let {
		selected = false,
		class: className = "",
		onclick = (() => {}) as MouseEventHandler<HTMLButtonElement>,
		children = undefined,
	} = $props();
</script>

<button
	type="button"
	{onclick}
	class="relative isolate overflow-hidden bg-sp-dark-grey px-3 py-1 rounded-full order-button before:content-[''] before:absolute before:inset-0 before:bg-sp-green/40 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200 before:-z-10 {className}"
	class:selected
>
	{@render children?.()}
</button>
