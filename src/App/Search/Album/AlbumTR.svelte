<script lang="ts">
    import { checkOnTabify } from "../../../lib/TabStore";
    import {
        getArtistObjAsString,
        getTimestamp,
        playSong,
    } from "../../../lib/utils";
    import { push } from "svelte-spa-router";
    import { onMount } from "svelte";

    import Loader from "../InTabifyIcon.svelte";
    import { CurrentTrack } from "../../../lib/SpotifyStateStore";

    export let track: SpotifyApi.TrackObjectSimplified;
    export let albumURI: string
    export let i: number;
    let inTabify;

    onMount(async () => {
        inTabify = await checkOnTabify(
            track.name,
            track.artists[0].name,
            track,
        );
    });
</script>

<tr
    class={`hover cursor-pointer rounded-xl ${
        inTabify ? "" : "grayscale opacity-40 "
    } ${
        $CurrentTrack && $CurrentTrack.uri === track.uri
            ? "text-primary"
            : ""
    
    }`}
    on:click={async () => {
        await playSong(undefined, albumURI, {uri: track.uri});
        push("/jam");
    }}
>
    <th>{i + 1}</th>
    <td class="text-xl">
        {track.name}
    </td>
    <td>{getArtistObjAsString(track.artists)}</td>
    <Loader {inTabify} />
    <td>{getTimestamp(track.duration_ms)}</td>
</tr>
