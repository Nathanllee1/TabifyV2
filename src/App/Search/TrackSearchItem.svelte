<script lang="ts">
    import { getArtistObjAsString, playSong } from "../../lib/utils";
    import { push } from "svelte-spa-router";
    import SearchItem from "./SearchItem.svelte";
    import { onMount } from "svelte";
    import { checkOnTabify } from "../../lib/TabStore";
    import InTabifyIcon from "./InTabifyIcon.svelte";

    export let track: SpotifyApi.TrackObjectFull;

    let inTabify

    onMount(async () => {
        inTabify = await checkOnTabify(
            track.name,
            track.artists[0].name,
            track,
        );
    })
</script>

<button
    on:click={async () => {
        await playSong(track.uri);
        push("/jam");
    }}
    class="md:flex-none flex-grow"
>
    <SearchItem on:click={async () => {
        await playSong(track.uri);
        push("/jam");
    }} imgSrc={track.album.images[1].url} title={track.name} greyedOut={!inTabify}>
        <div slot="label" class="flex justify-between">
            <div class="badge badge-neutral">Track</div>
            <InTabifyIcon {inTabify} />
        </div>

        <div class="tooltip" data-tip={getArtistObjAsString(track.artists)}>
            <div class="text-left">
                {getArtistObjAsString(track.artists)}
            </div>
        </div>
    </SearchItem>
</button>
