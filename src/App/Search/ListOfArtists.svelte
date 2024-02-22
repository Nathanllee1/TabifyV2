<script lang="ts">
    import { link } from "svelte-spa-router";


    export let artists: SpotifyApi.ArtistObjectSimplified[] | Spotify.Entity[]

</script>


{#each artists as artist, i}
    <a
        class="hover:underline"
        href={`/artist/${artist.uri.split(":").slice(-1)}`}
        use:link>{`${artist.name}${i < artists.length - 1 ? ", " : ""}`}</a>

{/each}
