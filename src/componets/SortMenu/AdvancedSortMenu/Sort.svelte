<script lang="ts">
	import { slide } from "svelte/transition";
	import type { Snippet } from "svelte";
	import { faSort } from "@fortawesome/free-solid-svg-icons";
	import FaIcon from "../../ui/FaIcon.svelte";

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();

	let sortOrder: string | undefined = $state();
</script>

<div
	class="flex flex-row p-1 gap-2 w-full h-8 items-center rounded-sm shrink-0 bg-sp-med-dark-grey"
>
	<FaIcon
		icon={faSort}
		class="w-fit h-4/5"
	></FaIcon>
	<div
		class="flex flex-row w-full h-full border-[1.5px] border-sp-light-grey rounded bg-sp-grey"
		class:border-dashed={!sortOrder}
	>{sortOrder}</div>
</div>
