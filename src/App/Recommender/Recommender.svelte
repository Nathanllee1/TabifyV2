<script lang="ts">
    import {
        buildURLWithParams,
        getArtistObjAsString,
        getHeaders,
        spotifyRequest,
    } from "../../lib/utils";
    import { CurrentTrack } from "../../lib/SpotifyStateStore";
    import { TabCache, getTab } from "../../lib/TabStore";
    import Icon from "@iconify/svelte";
    import { clickOutside } from "../../lib/utils";
    import animatedDetails from "svelte-animated-details";
    import { fade } from "svelte/transition";
    import { requestRecommendations } from "./Queue";
    import { get } from "svelte/store";
    import {
        recommendationOpen,
        recommendations,
        getRecommendations,
        recommendationLoading,
    } from "./RecommendationOpen";
</script>

<details
    class="dropdown rounded-xl bg-base-200 fixed top-[85px] right-[20px] max-w-[350px] z-40 "
    bind:open={$recommendationOpen}
    use:animatedDetails
>
    <summary class="flex cursor-pointer p-4">
        <div class="flex gap-2 w-full justify-between">
            <Icon
                class="self-center"
                icon={$recommendationOpen ? "tabler:arrow-up" : ""}
                style="font-size:25px;"
            />

            {#if $recommendationOpen}
                <div class="self-center">Recommended Songs</div>
                {#if !$recommendationLoading}
                    <button
                        class="btn btn-sm hover:bg-primary rounded-lg z-50 justify-self-end"
                        on:click={(ev) => {
                            ev.stopPropagation();
                            getRecommendations(get(CurrentTrack).id);
                        }}
                    >
                        <div class="">
                            <Icon
                                icon="material-symbols:refresh"
                                style="font-size:25px;"
                            />
                        </div>
                    </button>
                {/if}
            {:else}
                <Icon
                    class="cursor-pinter self-center"
                    icon="tabler:bulb"
                    style="font-size:25px;"
                />
            {/if}
            {#if $recommendationLoading}
                <span class="loading loading-spinner loading-sm"></span>
            {/if}
        </div>
    </summary>
    <ul class="overflow-auto max-h-[300px] p-4">
        {#each $recommendations as recommededSong}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                class="flex p-2 gap-4 hover:bg-primary hover:text-white rounded-xl cursor-pointer min-w-max"
                on:click={async () => {
                    const headers = getHeaders();
                    await fetch("https://api.spotify.com/v1/me/player/play", {
                        method: "PUT",
                        body: JSON.stringify({
                            uris: [recommededSong.uri],
                            // context_uri: track.uri
                        }),
                        headers,
                    });
                }}
                in:fade
            >
                <img
                    src={recommededSong.album.images[
                        recommededSong.album.images.length - 1
                    ].url}
                    alt={recommededSong.name}
                />
                <div class="text-left">
                    <div class="font-bold">{recommededSong.name}</div>
                    <div>{getArtistObjAsString(recommededSong.artists)}</div>
                </div>
            </div>
        {/each}

        {#if $recommendationLoading}
            <div class="skeleton w-[230px] h-[100px]"></div>
        {/if}
    </ul>
</details>

<style>
    details {
        overflow: hidden;
    }
</style>
