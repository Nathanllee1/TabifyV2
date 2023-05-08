<script lang="ts">
    import { spotifyRequest } from "../lib/utils";
    import { onMount } from "svelte";

    export let songId;
    let song: SpotifyApi.TrackObjectFull = undefined;

    onMount(async () => {
        song = await spotifyRequest(
            `https://api.spotify.com/v1/tracks/${songId.SONG_ID}`
        );
    });
</script>

{#if song}
    <div class="relative group" on:mouseover={() => {}} on:focus={() => {}}>
        <img class="group-hover:brightness-50" src={song.album.images[0].url} alt={song.name} width="110px" />
        <div class="absolute w-[100px] h-[100px] overflow-hidden top-2 left-2 hidden group-hover:block text-white">{song.name}</div>
    </div>
{/if}
