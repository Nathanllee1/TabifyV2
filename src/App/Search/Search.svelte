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
    import TrackSearchItem from "./TrackSearchItem.svelte";
    import { calculateTextMatchingScore } from "../../lib/TextMatching";
    import { searchLoadingStore } from "../../lib/SearchLoading";

    let results: SpotifyApi.SearchResponse;
    let searchText: string;
    let topResult: SpotifyApi.ArtistObjectFull | SpotifyApi.TrackObjectFull;

    function getTopItem(results: SpotifyApi.SearchResponse) {
        const allItems = [...results.artists.items, ...results.tracks.items];

        const scoredItems = allItems.map((item) => {
            const textMatchingScore = calculateTextMatchingScore(
                searchText,
                item.name,
            );
            const adjustedPopularity = item.popularity / 100;

            const overallScore =
                textMatchingScore * 0.9 + adjustedPopularity * 0.1;

            return {
                overallScore,
                item,
            };
        });

        calculateTextMatchingScore;

        const top = scoredItems.reduce((prev, current) => {
            if (!prev || current.overallScore > prev.overallScore) {
                return current;
            }
            return prev;
        });

        return top.item;
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

        searchText = new URLSearchParams(query).get("q");

        const search = buildURLWithParams("https://api.spotify.com/v1/search", {
            q: encodeURIComponent(searchText),
            type: "track,album,artist",
            limit: "4",
        });

        searchLoadingStore.set(true);
        results = await spotifyRequest(search, "GET", undefined);

        topResult = getTopItem(results);

        searchLoadingStore.set(false);
        return results;
    }

    const debounceLookup = debounce(lookUp);

    querystring.subscribe(async (query) => {
        debounceLookup(query);
    });
</script>

<div class="lg:p-10 p-2 overflow-y-auto flex-wrap text-left">
    <br />
    <div class="flex flex-wrap gap-10 justify-center">
        {#if results}
            {#if topResult}
                <div>
                    <div class="text-3xl font-bold">Top Result</div>
                    <br />

                    {#if topResult.type === "artist"}
                        <a
                            class="md:flex-none flex-grow"
                            href={`/artist/${topResult.id}`}
                            use:link
                        >
                            <SearchItem
                                imgSrc={topResult?.images[0]?.url}
                                title={topResult?.name}
                            >
                                <div slot="label">
                                    <div class="badge badge-neutral">
                                        Artist
                                    </div>
                                </div></SearchItem
                            >
                        </a>
                    {:else}
                        <button
                            on:click={async () => {
                                await playSong(topResult.uri);
                                push("/jam");
                            }}
                        >
                            <div>
                                <TrackSearchItem track={topResult} />

                            </div>
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
                            <TrackSearchItem {track} />
                        {/each}
                    </div>
                {/if}

                <br />
                {#if results.artists}
                    <div class="text-3xl">Artists</div>
                    <br />
                    <div class="flex flex-wrap gap-4">
                        {#each results.artists.items as artist}
                            <a
                                class="md:flex-none flex-grow"
                                href={`/artist/${artist.id}`}
                                use:link
                            >
                                <SearchItem
                                    imgSrc={artist?.images[0]?.url}
                                    title={artist?.name}
                                >
                                    <div slot="label">
                                        <div class="badge badge-neutral">
                                            Artist
                                        </div>
                                    </div></SearchItem
                                >
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
                            <a
                                href={`/album/${album.id}`}
                                use:link
                                class="md:flex-none flex-grow"
                            >
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
