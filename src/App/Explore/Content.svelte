<script lang="ts">
    import { FastAverageColor } from "fast-average-color";
    import { getArtistObjAsString, getHeaders } from "../../lib/utils";
    import { onMount } from "svelte";
    import { AppPage } from "../../lib/AppPage";

    export let trackObj: {
        track: SpotifyApi.TrackObjectFull;
        availableOnTabify: boolean;
    };

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

<div
    class={`${
        trackObj.availableOnTabify
            ? ""
            : "grayscale opacity-40 backdrop-brightness-50"
    }`}
>
    <button
        class="card card-compact border-2 rounded-lg w-72 bg-base transition ease-in-out delay-200 hover:scale-105 h-full"
        style={`border-color: ${borderColor}`}
        on:click={async () => {
            const headers = getHeaders();
            await fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                body: JSON.stringify({
                    uris: [track.uri],
                }),
                headers,
            });

            AppPage.set("main");
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
                {#if trackObj.availableOnTabify}
                    <div class="badge badge-primary">Available on Tabify</div>
                {:else}
                    <div class="badge badge-ghost">Unavailable on Tabify</div>
                {/if}
                <div class="card-title font-bold mt-2">{track.name}</div>
                <div>{getArtistObjAsString(track.artists)}</div>
            </div>
        </div>
    </button>
</div>
