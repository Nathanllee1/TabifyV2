<script lang="ts">
    import {
        buildURLWithParams,
        getArtistObjAsString,
        getHeaders,
        spotifyRequest,
    } from "../../lib/utils";
    import { CurrentTrack } from "../../lib/SpotifyStateStore";
    import { TabCache, getTab } from "../../lib/TabStore";

    let recommededSongs: SpotifyApi.RecommendationTrackObject[] = [];
    let loading = false;

    CurrentTrack.subscribe(async (track) => {
        console.log(track.name);

        recommededSongs = [];
        loading = true;

        const recommendations: SpotifyApi.RecommendationsFromSeedsResponse =
            await spotifyRequest(
                buildURLWithParams(
                    "https://api.spotify.com/v1/recommendations",
                    {
                        seed_tracks: track.id,
                        limit: "5",
                    },
                ),
            );

        const fetchedSongs = await Promise.all(
            recommendations.tracks.map((track) => {
                return (async () => {
                    const tabs = await getTab(
                        track.name,
                        track.artists[0].name,
                        track,
                    );

                    TabCache.update((cache) => {
                        cache[track.id] = tabs;
                        return cache;
                    });

                    return {
                        track,
                        availableOnTabify: tabs && tabs.length !== 0,
                    };
                })();
            }),
        );

        const filteredSongs = fetchedSongs
            .filter((obj) => obj.availableOnTabify)
            .map((filteredSong) => filteredSong.track);

        loading = false;
        recommededSongs = filteredSongs;
    });
</script>

<div class="card rounded-xl p-4 bg-base-200 fixed top-[100px] left-[20px]">
    <div>
        <span class="font-bold text-xl mr-4">Recommeded Songs</span>
        {#if loading}
            <span class="loading loading-spinner"></span>
        {/if}
    </div>

    {#each recommededSongs as recommededSong}
        <div class="flex pt-4 gap-4 hover:bg-primary">
            <img
                src={recommededSong.album.images[
                    recommededSong.album.images.length - 1
                ].url}
                alt={recommededSong.name}
            />
            <div>
                <span class="font-bold">{recommededSong.name}</span> - {getArtistObjAsString(
                    recommededSong.artists,
                )}
            </div>
        </div>
    {/each}
</div>
