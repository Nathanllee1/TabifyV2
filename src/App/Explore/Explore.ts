import { TabCache, checkOnTabify, getTab } from "../../lib/TabStore"
import { buildURLWithParams, spotifyRequest } from "../../lib/utils"
import { writable } from "svelte/store"


export const yourExploreStore = (() => {
    const { update, subscribe, set } = writable<{
        track: SpotifyApi.TrackObjectFull,
        availableOnTabify: boolean
    }[]>([])

    return {
        update,
        subscribe,
        set,
        getPlaylists: async () => {
            const topUserSongs: SpotifyApi.UsersTopTracksResponse = await spotifyRequest(buildURLWithParams("https://api.spotify.com/v1/me/top/tracks", {
                limit: "12",
                time_range: "short_term"
            }))


            const filteredSongs = (await Promise.all(topUserSongs.items.map((item) => {
                return (async () => {
                    const availableOnTabify = await checkOnTabify(item.name, item.artists[0].name, item)

                    return {
                        track: item,
                        availableOnTabify
                    }
                })()
            })))

            console.log(filteredSongs)

            set(filteredSongs)

        }
    }
})()