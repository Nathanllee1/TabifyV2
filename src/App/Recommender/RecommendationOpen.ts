import { CurrentTrack } from "../../lib/SpotifyStateStore";
import { writable } from "svelte/store";
import { requestRecommendations } from "./Queue";
import { TabCache, getTab } from "../../lib/TabStore";


export const recommendationOpen = writable(false)


export const recommendations = writable<SpotifyApi.RecommendationTrackObject[]>([])
export const recommendationLoading = writable(false)

export async function getRecommendations(id: string) {
    recommendationLoading.set(true);
    recommendations.set([])
    const spotifyRecs = await requestRecommendations(id);

    await Promise.all(
        spotifyRecs.tracks.map((track) => {
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

                if (tabs && tabs.length !== 0) {
                    recommendations.update(recommendation => {
                        return [...recommendation, track]
                    })
                }
            })();
        }),
    );

    recommendationLoading.set(false)
}

CurrentTrack.subscribe(async (track) => {
    await getRecommendations(track.id);
});