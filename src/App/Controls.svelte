<script lang="ts">
    import Icon from "@iconify/svelte";
    import { getTimestamp } from "../lib/utils";
    import { SpotifyState } from "../lib/SpotifyStateStore";
    import { ThemeColors } from "../lib/ThemeStore";
    import { Progress } from "../lib/ProgressStore";
    import { AppStore } from "../lib/AppStore";
    import { AutoScroll } from "../lib/Autoscroll";

    $: spotifyState = $SpotifyState;
    $: themeColors = $ThemeColors;
    $: progress = $Progress;
    $: appStore = $AppStore;

</script>

<div
    class=" h-30 p-2 text-neutral-content w-full mt-auto"
    style="background-color:{themeColors.albumColor};color:{themeColors.textColor}"
    id="footer"
>
    <div class="flex w-full align-middle gap-4">
        {#if spotifyState && spotifyState.track_window}
            <div class="flex-none self-center">
                <img
                    crossorigin="anonymous"
                    src={spotifyState.track_window.current_track.album.images[1]
                        .url}
                    alt={spotifyState.track_window.current_track.album.name}
                />
            </div>

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
                            // AutoScroll.updateSize();
                        }}
                    >
                        <Icon class="cursor-pointer" icon="bi:skip-end" />
                    </div>
                </div>
                <div class="flex gap-2 align-middle">
                    <div class="mb-1 font-mono">
                        {getTimestamp(progress.songMS)}
                    </div>

                    <input
                        type="range"
                        min="0"
                        max={progress.maxMS}
                        value={progress.songMS}
                        class="range range-xs"
                        on:change={async (e) => {
                            // @ts-ignore
                            const location = parseInt(e.target.value);

                            await appStore.player.seek(location);
                            Progress.seek(location);
                        }}
                    />
                    <div class="font-mono">
                        {getTimestamp(progress.maxMS)}
                    </div>
                </div>
            </div>
            <div class="basis-1/4">
                
                <label
                    class="label cursor-pointer justify-center gap-2 mt-5"
                >
                    <span class="">Autoscroll</span>
                    <input
                        type="checkbox"
                        class="toggle"
                        on:click={(e) => {
                            // @ts-ignore
                            const checked = e.target.checked;
                            checked
                                ? AutoScroll.check()
                                : AutoScroll.uncheck();
                        }}
                    />
                </label>
                
            </div>
        {/if}
    </div>
</div>
