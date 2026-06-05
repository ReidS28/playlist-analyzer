<script lang="ts">
	import { slide } from "svelte/transition";
	import type { Snippet } from "svelte";
	import {
		faSort,
		faArrowUp,
		faArrowDown,
	} from "@fortawesome/free-solid-svg-icons";
	import FaIcon from "../../ui/FaIcon.svelte";
	import Trait from "./Trait.svelte";

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();

	let sortOrder: string | undefined = $state("");
	let reversed: boolean = $state(false);
</script>

<div
	class="flex flex-row p-1 gap-2 w-full h-8 items-center rounded-sm shrink-0 bg-sp-med-dark-grey"
>
	<FaIcon
		icon={faSort}
		class="w-fit h-4/5"
	></FaIcon>
	<Trait
		{sortOrder}
		class="m-auto"
	></Trait>

	<button
        onclick={() => {reversed = !reversed}}
		class="h-full aspect-square shrink-0 rounded-sm items-center hover:bg-sp-green/40 bg-sp-grey"
	>
		<FaIcon
			icon={!reversed? faArrowUp : faArrowDown}
			class="w-fit h-4/5 m-auto"
		></FaIcon>
	</button>
</div>
