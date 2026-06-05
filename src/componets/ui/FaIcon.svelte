<script lang="ts">
	import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

	interface Props {
		icon: IconDefinition;
		class?: string;
	}

	let { icon, class: className = "" }: Props = $props();

	let paths = $derived(
		Array.isArray(icon.icon[4]) ? icon.icon[4] : [icon.icon[4]],
	);
</script>

<svg
	viewBox="0 0 {icon.icon[0]} {icon.icon[1]}"
	class="fill-current shrink-0 {className}"
>
	{#each paths as pathData}
		<path d={pathData} />
	{/each}
</svg>
