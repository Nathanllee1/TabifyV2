import { TabCache, getTab } from "../../lib/TabStore"
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
                    const tabs = await getTab(item.name, item.artists[0].name, item)

                    TabCache.update(cache => {
                        cache[item.id] = tabs;
                        return cache
                    })

                    return {
                        track: item,
                        availableOnTabify: tabs && tabs.length !== 0
                    }
                })()
            })))

            console.log(filteredSongs)

            set(filteredSongs)

        }
    }
})()