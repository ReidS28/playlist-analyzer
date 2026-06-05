<script lang="ts">
	import { slide } from "svelte/transition";
	import type { Snippet } from "svelte";
	import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";


	import FaIcon from "../../ui/FaIcon.svelte";

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();
</script>

<div class="flex flex-row p-1 gap-1 w-full h-8 items-center rounded-sm shrink-0 bg-sp-med-dark-grey">
	<FaIcon
		icon={faLayerGroup}
		class="w-fit h-4/5"
	></FaIcon>
	{@render children?.()}
</div>
