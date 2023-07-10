<script lang="ts">
    import { clickOutside, getHeaders, spotifyRequest } from "../lib/utils";

    let query = "";
    let active = false;
    let results: SpotifyApi.SearchResponse;

    async function searchSpotify() {
        if (query.length < 2) {
            return;
        }
        active = true;

        const search = new URL("https://api.spotify.com/v1/search");
        search.searchParams.append("q", encodeURIComponent(query));
        search.searchParams.append("type", "track");
        search.searchParams.append("limit", "10");

        results = await spotifyRequest(search.toString(), "GET", undefined);
    }
</script>

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
            class="absolute top-16 bg-white shadow-xl z-10 rounded-xl border-[1px] p-4 max-w-md overflow-y-scroll max-h-96"
            use:clickOutside
            on:click_outside={() => (active = false)}
        >
            {#if results.tracks.items.length === 0}
                <div class="w-[300px] text-gray-500">
                    No results
                </div>
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

                    <div
                        class="btn btn-outline btn-sm self-center"
                        on:click={async () => {
                            const headers = getHeaders();

                            await fetch(
                                `https://api.spotify.com/v1/me/player/queue?uri=${track.uri}`,
                                {
                                    headers,
                                    method: "POST"
                                }
                            );
                            active = false;
                            query = "";
                        }}
                    >
                        Queue
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
