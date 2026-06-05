import { checkOnTabify } from "../../lib/TabStore"
import { buildURLWithParams, spotifyRequest } from "../../lib/utils"
import { writable } from "svelte/store"

export type ExploreTrack = {
    track: SpotifyApi.TrackObjectFull,
    availableOnTabify: boolean
}

type ExploreStoreValue = {
    recentlyReady: ExploreTrack[],
    favoritesReady: ExploreTrack[],
    topArtists: SpotifyApi.ArtistObjectFull[],
    loading: boolean
}

const emptyExploreStore: ExploreStoreValue = {
    recentlyReady: [],
    favoritesReady: [],
    topArtists: [],
    loading: true
}

const getTopTracksOnTabify = async (timeRange: "short_term" | "medium_term" | "long_term") => {
    const topUserSongs: SpotifyApi.UsersTopTracksResponse = await spotifyRequest(buildURLWithParams("https://api.spotify.com/v1/me/top/tracks", {
        limit: "24",
        time_range: timeRange
    }))

    const filteredSongs = await Promise.all(topUserSongs.items.map((item) => {
        return (async () => {
            const availableOnTabify = await checkOnTabify(item.name, item.artists[0].name, item)

            return {
                track: item,
                availableOnTabify
            }
        })()
    }))

    return filteredSongs.filter((song) => song.availableOnTabify)
}

const uniqueTracks = (tracks: ExploreTrack[], excludeTrackIds: Set<string>) => {
    return tracks.filter((trackObj) => {
        if (excludeTrackIds.has(trackObj.track.id)) {
            return false
        }

        excludeTrackIds.add(trackObj.track.id)
        return true
    })
}

export const yourExploreStore = (() => {
    const { update, subscribe, set } = writable<ExploreStoreValue>(emptyExploreStore)

    return {
        update,
        subscribe,
        set,
        getPlaylists: async () => {
            set(emptyExploreStore)

            const [recentlyReady, mediumTermReady, longTermReady, topArtistsResponse] = await Promise.all([
                getTopTracksOnTabify("short_term"),
                getTopTracksOnTabify("medium_term"),
                getTopTracksOnTabify("long_term"),
                spotifyRequest(buildURLWithParams("https://api.spotify.com/v1/me/top/artists", {
                    limit: "10",
                    time_range: "medium_term"
                }))
            ])

            const recentTrackIds = new Set(recentlyReady.map((song) => song.track.id))

            set({
                recentlyReady,
                favoritesReady: uniqueTracks([...mediumTermReady, ...longTermReady], recentTrackIds),
                topArtists: topArtistsResponse.items || [],
                loading: false
            })
        }
    }
})()
