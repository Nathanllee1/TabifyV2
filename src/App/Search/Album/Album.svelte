<script lang="ts">
    import { link, push } from "svelte-spa-router";
    import {
        getArtistObjAsString,
        getTimestamp,
        playSong,
        spotifyRequest,
    } from "../../../lib/utils";
    import { onMount } from "svelte";
    import AlbumTr from "./AlbumTR.svelte";
    import ListOfArtists from "../ListOfArtists.svelte";
    import { CurrentTrack } from "../../../lib/SpotifyStateStore";

    export let params;

    let album: SpotifyApi.AlbumObjectFull;

    onMount(async () => {
        album = await spotifyRequest(
            `https://api.spotify.com/v1/albums/${params.id}`,
        );
    });
</script>

<div class="p-10 overflow-y-auto gap-10">
    {#if album}

        <div class="flex justify-center">
            <div class="flex gap-10 flex-wrap pl-5">
                <div>
                    <a href={album.external_urls.spotify} target="_blank">
                        <img
                            src={album.images[1].url}
                            width="300px"
                            height="300px"
                            alt={album.name}
                            class="shrink-0"
                        />
                    </a>
                </div>
                <div class="w-[370px]">
                    <a
                        href={album.external_urls.spotify}
                        target="_blank"
                        class="link link-hover text-4xl font-bold"
                        >{album.name}</a
                    >
                    <br />
                    <br />
                    <ListOfArtists artists={album.artists} />
                    <br />
                    <br />
                    <div>{album.release_date.split("-")[0]}</div>
                    <br />

                    <button
                        class="btn btn-primary btn-sm"
                        on:click={async () => {
                            await playSong(undefined, album.uri);
                            push("/jam");
                        }}>Play</button
                    >

                    <br />
                </div>
            </div>
        </div>
        <br />
        <div class="flex justify-center">
            <table class="table max-w-[800px]">
                {#each album.tracks.items as track, i}
                    <AlbumTr {i} {track} albumURI={album.uri} />
                {/each}
            </table>
        </div>
    {/if}
</div>
