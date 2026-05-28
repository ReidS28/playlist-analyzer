<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements";

	let {
		class: className = "",
		onclick = (() => {}) as MouseEventHandler<HTMLButtonElement>,
		children = undefined,
	} = $props();
</script>

<button
	type="button"
	onclick={onclick}
	class="bg-[#212121] px-3 py-1 rounded-full {className}"
	>{@render children?.()}</button
>
