<script>
	let { class: className, children } = $props();
</script>

<ul
	class="flex flex-col gap-1 p-1 bg-gray-900 rounded-xl border border-gray-200 w-full h-full overflow-y-auto scrollbar-thumb-sp-green *:shrink-0 *:w-full *:h-20 {className}"
>
	{@render children?.()}
</ul>
