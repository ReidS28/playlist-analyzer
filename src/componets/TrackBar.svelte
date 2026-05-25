<script>
	import coldSpaceImg from "../assets/covers/Cold Space.png";
	let { title, artist, cover_src = "" ,class: className = "" } = $props();

	const trackStyle = "text-xl font-semibold text-white truncate";
	const artistStyle = "text-xl text-gray-300 font-medium truncate";
</script>

<div class="flex items-center gap-3 bg-gray-700 rounded-md p-1 {className}">
	<img
		class="h-full rounded-lg"
		src={cover_src}
		alt="Album Cover"
	/>
	<div class="flex flex-col w-full h-full">
		<span class={trackStyle}>{title}</span>
		<span class={artistStyle}>{artist}</span>
	</div>
</div>
