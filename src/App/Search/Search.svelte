<script lang="ts">
    import {
        buildURLWithParams,
        getArtistObjAsString,
        playSong,
        spotifyRequest,
    } from "../../lib/utils";
    import { link, push, querystring } from "svelte-spa-router";
    import SearchItem from "./SearchItem.svelte";
    import Artist from "./Artist/Artist.svelte";

    let results: SpotifyApi.SearchResponse;

    let topResult: SpotifyApi.ArtistObjectFull | SpotifyApi.TrackObjectFull;

    function getMaxPopularity(results: SpotifyApi.SearchResponse) {
        const allItems = [...results.artists.items, ...results.tracks.items];

        const top = allItems.reduce((prev, current) => {
            if (!prev || current.popularity > prev.popularity) {
                return current;
            }
            return prev;
        });

        return top;
    }

    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, timeout);
        };
    }

    async function lookUp(query: string) {
        console.log(query.length);
        if (query.length <= 2) {
            return;
        }

        console.log("LOOKING UP");
        const rawText = new URLSearchParams(query).get("q");

        console.log(rawText);

        const search = buildURLWithParams("https://api.spotify.com/v1/search", {
            q: encodeURIComponent(rawText),
            type: "track,album,artist",
            limit: "4",
        });

        results = await spotifyRequest(search, "GET", undefined);

        topResult = getMaxPopularity(results);

        return results;
    }

    const debounceLookup = debounce(lookUp);

    querystring.subscribe(async (query) => {
        debounceLookup(query);
    });
</script>

<div class="p-10 overflow-y-auto flex-wrap text-left">
    <br />
    <div class="flex flex-wrap gap-10 justify-center">
        {#if results}
            {#if topResult}
                <div>
                    <div class="text-3xl font-bold">Top Result</div>
                    <br />

                    {#if topResult.type === "artist"}
                        <a href={`/artist/${topResult.id}`} use:link>
                            <SearchItem
                                imgSrc={topResult.images[0].url}
                                title={topResult.name}
                                top={true}
                            >
                                <div slot="label">Artist</div>
                            </SearchItem>
                        </a>
                    {:else}
                        <button
                            on:click={async () => {
                                await playSong(topResult.uri);
                                push("/jam");
                            }}
                        >
                            <SearchItem
                                imgSrc={topResult.album.images[1].url}
                                title={topResult.name}
                                top={true}
                            >
                                <div slot="label">Track</div>
                                
                            </SearchItem>
                        </button>
                    {/if}
                </div>
            {/if}

            <div>
                {#if results.tracks}
                    <div class="text-3xl">Tracks</div>
                    <br />
                    <div class="flex flex-wrap gap-4 align-top">
                        {#each results.tracks.items as track}
                            <button
                                on:click={async () => {
                                    await playSong(track.uri);
                                    push("/jam");
                                }}
                            >
                                <SearchItem
                                    imgSrc={track.album.images[1].url}
                                    title={track.name}
                                >
                                    {getArtistObjAsString(track.artists)}
                                </SearchItem>
                            </button>
                        {/each}
                    </div>
                {/if}

                <br />
                {#if results.artists}
                    <div class="text-3xl">Artists</div>
                    <br />
                    <div class="flex flex-wrap gap-4">
                        {#each results.artists.items as artist}
                            <a href={`/artist/${artist.id}`} use:link>
                                <SearchItem
                                    imgSrc={artist?.images[0]?.url}
                                    title={artist?.name}
                                />
                            </a>
                        {/each}
                    </div>
                {/if}

                <br />
                {#if results.albums}
                    <div class="text-3xl">Albums</div>
                    <br />
                    <div class="flex flex-wrap gap-4">
                        {#each results.albums.items as album}
                            <a href={`/album/${album.id}`} use:link>
                                <SearchItem
                                    imgSrc={album?.images[0]?.url}
                                    title={album?.name}
                                />
                            </a>
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>
