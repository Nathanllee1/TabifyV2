<script lang="ts">
    import { spotifyRequest } from "../lib/utils";
    import { onMount } from "svelte";

    export let songId;
    let song: SpotifyApi.TrackObjectFull = undefined;

    onMount(async () => {
        song = await spotifyRequest(`https://api.spotify.com/v1/tracks/${songId.SONG_ID}`)
    });
</script>

{#if song}
<div class="">
    <div class="tooltip" data-tip={`${song.name}: ${songId.TIMES_PLAYED}`}>
        <img src={song.album.images[0].url} alt={song.name} width=110px />

    </div>

</div>

{/if}
