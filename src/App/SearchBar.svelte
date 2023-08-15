<script lang="ts">
    import { buildURLWithParams, clickOutside, getHeaders, spotifyRequest } from "../lib/utils";
    import HelpTooltip from "./HelpTooltip.svelte";

    let query = "";
    let active = false;
    let results: SpotifyApi.SearchResponse;

    async function searchSpotify() {
        if (query.length < 2) {
            active = false;
            return;
        }
        active = true;
    
        const search = buildURLWithParams("https://api.spotify.com/v1/search", {
            "q": encodeURIComponent(query),
            "type": "track",
            "limit": "10"
        })

        results = await spotifyRequest(search, "GET", undefined);
    }
</script>

<div class="flex gap-2">
    <div class="self-center">
        <input
            type="text"
            placeholder="Search Spotify"
            class="input w-full max-w-5xl"
            bind:value={query}
            on:input={() => searchSpotify()}
            on:click={() => (active = true)}
        />
        {#if active && results && results.tracks.items}
            <!-- @ts-ignore -->
            <div
                class="absolute top-16 bg-base-100  shadow-xl z-10 rounded-xl p-4 max-w-md overflow-y-scroll max-h-96 mt-4"
                use:clickOutside
                on:click_outside={() => (active = false)}
            >
                {#if results.tracks.items.length === 0}
                    <div class="w-[300px] text-gray-500">No results</div>
                {/if}
                {#each results.tracks.items as track}
                    <div class=" flex justify-between gap-4">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div
                            class="hover:bg-primary hover:text-white cursor-pointer rounded-lg flex grow mt-auto align-middle"
                            on:click={async () => {
                                const headers = getHeaders();
                                await fetch(
                                    "https://api.spotify.com/v1/me/player/play",
                                    {
                                        method: "PUT",
                                        body: JSON.stringify({
                                            uris: [track.uri],
                                            // context_uri: [track.uri]
                                        }),
                                        headers,
                                    }
                                );
                                active = false;
                                query = "";
                            }}
                        >
                            <div class="p-1 shrink-0">
                                <img
                                    src={track.album.images[0].url}
                                    alt={track.name}
                                    width="50px"
                                />
                            </div>
                            <div
                                class="pl-4 p-2 max-w-10 justify-self-start self-center"
                            >
                                <div>
                                    {track.name}
                                </div>
                                <div class="text-slate-400">
                                    {track.artists
                                        .map((artist) => artist.name)
                                        .join(", ")}
                                </div>
                            </div>
                        </div>
    
                        <button
                            class="btn btn-outline btn-sm self-center"
                            on:click={async () => {
                                const headers = getHeaders();
    
                                await fetch(
                                    `https://api.spotify.com/v1/me/player/queue?uri=${track.uri}`,
                                    {
                                        headers,
                                        method: "POST",
                                    }
                                );
                                active = false;
                                query = "";
                            }}
                        >
                            Queue
                        </button>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
    <div class="hidden lg:block">
        <HelpTooltip message="Quickly play and queue songs" />

    </div>
    
</div>
