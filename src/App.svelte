<script lang="ts">
    import {
        SpotifyState,
        AppStore,
        Tab,
        Progress,
        ThemeColors,
    } from "./lib/stores";
    import { fade, fly } from "svelte/transition";
    import Icon from "@iconify/svelte";

    $: appStore = $AppStore;
    $: spotifyState = $SpotifyState;
    $: tab = $Tab;
    $: progress = $Progress;
    $: themeColors = $ThemeColors;
</script>

<div class="flex flex-col min-h-screen max-h-screen text-neutral">
    {#if !appStore.connected}
        <input type="checkbox" id="my-modal" class="modal-toggle" checked />
        <div class="modal">
            <div class="modal-box">
                <div class="text-3xl font-bold ">Get started</div>
                <div class="mb-4">Select Tabify as your device</div>
                <div class="text-xl mb-4">Desktop</div>
                <img src="/device_tabify.png" alt="Desktop setup" />
                <div class="divider">OR</div>
                <div class="text-xl mb-4">Mobile</div>
                <img class="mb-4" src="/mobile_1.jpg" alt="Mobile 1" />
                <img src="/mobile_2.jpg" alt="Mobile 2" />
                <div class="divider">Troubleshooting</div>
                <div>If Tabify doesn't show up or disappears after clicking, exit Spotify and reload Tabify. If that doesn't work, wait a bit</div>
            </div>
        </div>
    {/if}

    {#if tab}
        {#await tab}
            <div>Loading</div>
        {:then tab_obj}
            <div
                class="overflow-y-auto overflow-x-hidden flex justify-center pt-10"
                transition:fade={{ duration: 300 }}
                
            >
                {#if tab_obj["TAB"] === "Tab not found."}
                    <div>
                        <div class="text-4xl mt-4">Tab not found</div>
                        <br />
                        <img
                            width="300px"
                            src="/notfound.svg"
                            alt="Not found icon"
                        />
                        <br />
                        <div>
                            Add one at <a
                                class="link"
                                href="https://www.ultimate-guitar.com/contribution/submit/tabs?app_utm_campaign=top_menu&app_utm_content=button&app_utm_medium=internal&app_utm_source=ug&app_utm_term=publish"
                                >Ultimate Guitar!</a
                            >
                        </div>
                    </div>
                {:else}
                    {@html tab_obj["TAB"]}
                {/if}
            </div>
        {/await}
    {/if}

    <div
        class=" h-30 p-2 text-neutral-content w-full mt-auto"
        style="background-color:{themeColors.albumColor};color:{themeColors.textColor}"
        id="footer"
    >
        <div class="flex w-full align-middle gap-4">
            {#if spotifyState && spotifyState.track_window}
                <img
                    crossorigin="anonymous"
                    src={spotifyState.track_window.current_track.album.images[1]
                        .url}
                    alt={spotifyState.track_window.current_track.album.name}
                />
                <div class="basis-1/4">
                    <div class="text-lg font-bold">
                        {spotifyState.track_window.current_track.name}
                    </div>
                    <div>
                        {#each spotifyState.track_window.current_track.artists
                            .map((artist) => artist.name)
                            .join(", ") as artist}
                            {artist}
                        {/each}
                    </div>
                </div>

                <div class="basis-2/4">
                    <div class="flex justify-center mt-3">
                        <div
                            class="tooltip"
                            data-tip="Previous"
                            on:click={async (ev) => {
                                if (progress.songMS < 5000) {
                                    await appStore.player.previousTrack();
                                    return;
                                }
                                await appStore.player.seek(0);
                                Progress.reset();
                            }}
                        >
                            <Icon
                                class="cursor-pointer"
                                icon="bi:skip-start"
                                style="font-size:25px;"
                            />
                        </div>

                        <div
                            on:click={(ev) => {
                                appStore.player.togglePlay();
                            }}
                        >
                            {#if progress.paused}
                                <div class="tooltip" data-tip="Play">
                                    <Icon
                                        style="font-size:25px;"
                                        class="cursor-pointer"
                                        icon="akar-icons:play"
                                    />
                                </div>
                            {:else}
                                <div class="tooltip" data-tip="Pause">
                                    <Icon
                                        style="font-size:25px;"
                                        class="cursor-pointer"
                                        icon="akar-icons:pause"
                                    />
                                </div>
                            {/if}
                        </div>
                        <div
                            class="tooltip"
                            data-tip="Next"
                            style="font-size:25px;" 
                            on:click={async (ev) => {
                                await appStore.player.nextTrack();
                            }}
                        >
                            <Icon class="cursor-pointer" icon="bi:skip-end" />
                        </div>
                    </div>

                    <progress
                        class="w-full h-1"
                        max={progress.maxMS}
                        value={progress.songMS}
                    />
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
</style>
