<script lang="ts">
    import { FastAverageColor } from "fast-average-color";
    import { getArtistObjAsString, playSong } from "../../lib/utils";
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";
    import type { ExploreTrack } from "./Explore";

    export let trackObj: ExploreTrack;

    let track = trackObj.track;

    let borderColor;
    onMount(async () => {
        borderColor = (
            await new FastAverageColor().getColorAsync(
                track.album.images[0].url
            )
        ).hex;
    });
</script>

<div class="px-2 py-3">
    <button
        class="card card-compact border-2 rounded-lg w-72 bg-base transition ease-in-out delay-200 hover:scale-105 h-full"
        style={`border-color: ${borderColor}`}
        on:click={async () => {
            await playSong(track.uri);
            push("/jam")
        }}
    >
        <figure>
            <img
                src={track.album.images[0].url}
                alt={track.name}
                width="300px"
            />
        </figure>
        <div class="w-full justify-start text-start p-4">
            <div class="w-full">
                <div class="badge badge-primary">Ready to Jam</div>
                <div class="card-title font-bold mt-2">{track.name}</div>
                <div>{getArtistObjAsString(track.artists)}</div>
            </div>
        </div>
    </button>
</div>
