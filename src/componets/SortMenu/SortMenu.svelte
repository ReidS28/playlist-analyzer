<script>
	import OrderButton from "./OrderButton.svelte";
</script>

<div
	class="flex flex-row p-1 gap-1 w-full h-10 bg-sp-black shrink-0 overflow-x-scroll scrollbar-none"
>
	<OrderButton onclick={() => console.log("Sorted By length")}>Length</OrderButton>
</div>
