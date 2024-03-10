import { CurrentTrack } from "../../lib/SpotifyStateStore";
import { writable } from "svelte/store";
import { requestRecommendations } from "./Queue";
import { TabCache, checkOnTabify, getTab } from "../../lib/TabStore";


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

                const onTabify = await checkOnTabify(track.name, track.artists[0].name, track)
                if (onTabify) {
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

    if (!track) {
        return
    }

    await getRecommendations(track.id);
});