<script>
	let { title, artist, cover_src = "", class: className = "" } = $props();
</script>

<div class="flex items-center gap-3 bg-[#303030] rounded-md p-1 {className}">
	<img
		class="h-full rounded-lg"
		src={cover_src}
		alt="Album Cover"
	/>
	<div class="flex flex-col w-full h-full">
		<span class="text-xl primaryText">{title}</span>
		<span class="text-xl secondaryText">{artist}</span>
	</div>
</div>
