<script lang="ts">
	import {
		faSort,
		faArrowUp,
		faArrowDown,
	} from "@fortawesome/free-solid-svg-icons";
	import FaIcon from "../../ui/FaIcon.svelte";
	import Trait from "./Trait.svelte";
	import type { SortObj } from "../../../lib/constants.svelte";

	interface Props {
		sort: SortObj;
		class?: string;
	}

	let { sort = $bindable(), class: className }: Props = $props();
</script>

<div
	class="flex flex-row p-1 gap-2 w-full h-8 items-center rounded-sm shrink-0 bg-sp-med-dark-grey {className}"
>
	<FaIcon
		icon={faSort}
		class="h-4/5 aspect-square shrink-0"
	></FaIcon>
	<Trait
		trait={sort.trait}
		display={false}
		class="flex-1 m-auto min-w-0"
	></Trait>
	<button
		onclick={(e) => {
			e.stopPropagation();
			sort.reversed = !sort.reversed;
		}}
		class="h-full aspect-square shrink-0 rounded-sm items-center hover:bg-sp-green/40 bg-sp-grey"
	>
		<FaIcon
			icon={!sort.reversed ? faArrowUp : faArrowDown}
			class="w-fit h-4/5 m-auto"
		></FaIcon>
	</button>
</div>
