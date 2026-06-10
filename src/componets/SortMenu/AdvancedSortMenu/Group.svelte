<script lang="ts">
	import { slide } from "svelte/transition";
	import type { Snippet } from "svelte";
	import {
		faLayerGroup,
		faArrowUp,
		faArrowDown,
	} from "@fortawesome/free-solid-svg-icons";
	import FaIcon from "../../ui/FaIcon.svelte";
	import Trait from "./Trait.svelte";
	import type { GroupObj } from "../../../lib/constants.svelte";

	interface Props {
		group: GroupObj;
		class?: string;
	}

	let { group = $bindable(), class: className }: Props = $props();
</script>

<div
	class="flex flex-row p-1 gap-2 w-full h-8 items-center rounded-sm shrink-0 bg-sp-med-dark-grey {className}"
>
	<FaIcon
		icon={faLayerGroup}
		class="h-4/5 aspect-square shrink-0"
	></FaIcon>
	<Trait
		traitKey={group.trait.traitKey}
		class="flex-1 m-auto min-w-0"
	></Trait>
	<button
		onclick={(e) => {
			e.stopPropagation();
			group.reversed = !group.reversed;
		}}
		class="h-full aspect-square shrink-0 rounded-sm items-center hover:bg-sp-green/40 bg-sp-grey"
	>
		<FaIcon
			icon={!group.reversed ? faArrowUp : faArrowDown}
			class="w-fit h-4/5 m-auto"
		></FaIcon>
	</button>
</div>
