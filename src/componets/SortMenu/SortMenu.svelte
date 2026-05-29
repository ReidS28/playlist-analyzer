<script lang="ts">
    import type { OrderedTrackList } from "../../lib/orderedTrackList.svelte";
    import OrderButton from "./OrderButton.svelte";

    let { tracks }: { tracks: OrderedTrackList } = $props();

    let currentSort = $state("custom");
</script>

<div class="flex flex-row p-1 gap-1 w-full h-10 bg-sp-black shrink-0 overflow-x-scroll scrollbar-none">
    
    <OrderButton 
        selected={currentSort === 'custom'} 
        onclick={() => { tracks?.resetOrder(); currentSort = 'custom'; }}>
        Custom
    </OrderButton>

    <OrderButton 
        selected={currentSort === 'name'} 
        onclick={() => { tracks?.sortName(); currentSort = 'name'; }}>
        Name
    </OrderButton>

    <OrderButton 
        selected={currentSort === 'artist'} 
        onclick={() => { tracks?.sortArtistName(); currentSort = 'artist'; }}>
        Artist
    </OrderButton>

    <OrderButton 
        selected={currentSort === 'length'} 
        onclick={() => { tracks?.sortLength(); currentSort = 'length'; }}>
        Length
    </OrderButton>

    <OrderButton 
        selected={currentSort === 'dateAdded'} 
        onclick={() => { tracks?.sortDateAdded(); currentSort = 'dateAdded'; }}>
        Date Added
    </OrderButton>

</div>