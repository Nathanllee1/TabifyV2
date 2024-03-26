<script lang="ts">
    import { getTimestamp, playSong, spotifyRequest } from "../../../lib/utils";
    import { onMount } from "svelte";
    import SearchItem from "../SearchItem.svelte";
    import { link, push } from "svelte-spa-router";
    import { FastAverageColor } from "fast-average-color";
    import ArtistTr from "./ArtistTR.svelte";

    export let params;

    let artistInfo: SpotifyApi.ArtistObjectFull;
    let topTracks: SpotifyApi.ArtistsTopTracksResponse;
    let albums: SpotifyApi.ArtistsAlbumsResponse;

    let artistColor;

    onMount(async () => {
        [artistInfo, topTracks, albums] = await Promise.all([
            spotifyRequest(
                `https://api.spotify.com/v1/artists/${params.name}/`,
            ),
            spotifyRequest(
                `https://api.spotify.com/v1/artists/${params.name}/top-tracks?market=US`,
            ),
            spotifyRequest(
                `https://api.spotify.com/v1/artists/${params.name}/albums?limit=8`,
            ),
        ]);

        artistColor = (
            await new FastAverageColor().getColorAsync(artistInfo.images[1].url)
        ).hex;

        console.log(artistColor);

        console.log(topTracks);
    });
</script>

<div class="p-10 overflow-y-auto gap-10">
    <div class="flex justify-center gap-10 flex-wrap">
        {#if artistInfo}
            <div class="max-w-[350px]">
                <div>
                    <a
                        href={artistInfo.external_urls.spotify}
                        target="_blank"
                        class={`hover:underline text-5xl font-bold text-primary`}
                    >
                        {artistInfo.name}
                    </a>
                </div>

                <br />
                <img
                    src={artistInfo?.images[0]?.url}
                    alt={artistInfo.name}
                    class="w-[350px] rounded-3xl"
                />
            </div>

            <table class="table max-w-[560px]">
                {#each topTracks.tracks.slice(0, 5) as track}
                    <ArtistTr {track} {artistInfo} />
                {/each}
            </table>
        {/if}
    </div>
    {#if albums}
        <div class="flex justify-center">
            <div class="">
                <br />
                <div class="text-3xl">Albums</div>
                <br />
                <div class="flex items-start">
                    <br />
                    <div class="flex gap-6 flex-wrap max-w-[1000px]">
                        {#each albums.items as album}
                            <a
                                href={`/album/${album.id}`}
                                use:link
                                class="md:flex-none flex-grow"
                            >
                                <SearchItem
                                    imgSrc={album.images[0].url}
                                    title={album.name}
                                >
                                    <div slot="label">
                                        {album.release_date.split("-")[0]}
                                    </div>
                                </SearchItem>
                            </a>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
