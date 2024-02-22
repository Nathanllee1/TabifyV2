<script lang="ts">
    import { checkOnTabify } from "../../lib/TabStore";
    import {
        getArtistObjAsString,
        getTimestamp,
        playSong,
    } from "../../lib/utils";
    import { push } from "svelte-spa-router";
    import { onMount } from "svelte";
    import InTabify from "./InTabify/InTabify.svelte";
    import NotInTabify from "./InTabify/NotInTabify.svelte";

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
    }`}n
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
    {#if inTabify !== undefined}
        {#if inTabify}
            <td><InTabify/></td>
        {:else}
            <td><NotInTabify /></td>
        {/if}
    {:else}
        <td><span class="loading loading-spinner loading-sm"></span></td>
    {/if}
    <td>{getTimestamp(track.duration_ms)}</td>
</tr>
