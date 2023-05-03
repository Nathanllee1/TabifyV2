<script lang="ts">
    import Icon from "@iconify/svelte";
    import { getTimestamp } from "../lib/utils";
    import { SpotifyState } from "../lib/SpotifyStateStore";
    import { ThemeColors } from "../lib/ThemeStore";
    import { Progress } from "../lib/ProgressStore";
    import { AppStore } from "../lib/AppStore";
    import { AutoScroll } from "../lib/Autoscroll";
</script>

<div
    class=" h-30 p-2 w-full mt-auto"
    style="background-color:{$ThemeColors.albumColor};color:{$ThemeColors.textColor}"

>
    <div class="flex w-full align-middle gap-4">
        {#if $SpotifyState && $SpotifyState.track_window}
            <div class="flex-none self-center">
                <img
                    class=""
                    crossorigin="anonymous"
                    src={$SpotifyState.track_window.current_track.album.images[1]
                        .url}
                    alt={$SpotifyState.track_window.current_track.album.name}
                />
            </div>

            <div class="lg:basis-1/4 basis-[45%] self-center">
                <div class="text-lg font-bold">
                    {$SpotifyState.track_window.current_track.name}
                </div>
                <div>
                    {#each $SpotifyState.track_window.current_track.artists
                        .map((artist) => artist.name)
                        .join(", ") as artist}
                        {artist}
                    {/each}
                </div>
            </div>

            <div class="lg:basis-2/4 basis-[10%] self-center">
                <div class="flex justify-center mt-3">
                    <div
                        class="tooltip"
                        data-tip="Previous"
                        on:click={async (ev) => {
                            // skips to the beginning and to the previous track if the progress is < 5 seconds
                            if ($Progress.songMS < 5000) {
                                await $AppStore.player.previousTrack();
                                return;
                            }
                            await $AppStore.player.seek(0);
                            Progress.reset();
                            AutoScroll.reset();
                        }}
                    >
                        <Icon
                            class="cursor-pointer"
                            icon="bi:skip-start"
                            style="font-size:25px;"
                        />
                    </div>

                    <!-- Controls -->
                    <div
                        on:click={(ev) => {
                            $AppStore.player.togglePlay();
                        }}
                    >
                        {#if $Progress.paused}
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
                            await $AppStore.player.nextTrack();
                            // AutoScroll.updateSize();
                        }}
                    >
                        <Icon class="cursor-pointer" icon="bi:skip-end" />
                    </div>
                </div>

                <!-- Song progress -->
                <div class="hidden gap-2 align-middle lg:flex">
                    <div class="mb-1 font-mono">
                        {getTimestamp($Progress.songMS)}
                    </div>

                    <input
                        type="range"
                        min="0"
                        max={$Progress.maxMS}
                        value={$Progress.songMS}
                        class="range range-xs"
                        on:change={async (e) => {
                            // @ts-ignore
                            const location = parseInt(e.target.value);

                            await $AppStore.player.seek(location);
                            Progress.seek(location);
                        }}
                    />
                    <div class="font-mono">
                        {getTimestamp($Progress.maxMS)}
                    </div>
                </div>
            </div>
            <div class="basis-[45%] lg:basis-1/4 place-self-center">
                <label class="label cursor-pointer justify-center gap-2 mt-5 flex-col lg:flex-row">
                    <span class="">Autoscroll</span>
                    <input
                        type="checkbox"
                        class="toggle"
                        on:click={(e) => {
                            // @ts-ignore
                            const checked = e.target.checked;
                            checked ? AutoScroll.check() : AutoScroll.uncheck();
                        }}
                    />
                </label>
            </div>
        {/if}
    </div>
</div>
