<script lang="ts">
    import { SpotifyState, AppStore, Tab } from "./lib/stores";
    import { fade } from "svelte/transition";
    import { prevent_default } from "svelte/internal";

    $: appStore = $AppStore;
    $: spotifyState = $SpotifyState;
    $: tab = $Tab;
</script>

<div class="flex flex-col min-h-screen max-h-screen">
    {#if !appStore.connected}
        <input type="checkbox" id="my-modal" class="modal-toggle" checked />
        <div class="modal">
            <div class="modal-box">Instructions</div>
        </div>
    {/if}

    {#if tab}
        {#await tab}
            <div>Loading</div>
        {:then tab_obj}
            <div class="overflow-auto flex justify-center" transition:fade>
                {@html tab_obj["TAB"]}
            </div>
        {/await}
    {/if}

    <div class=" h-30 p-2 bg-neutral text-neutral-content w-full mt-auto">
        <div class="flex w-full align-middle gap-4">
            {#if spotifyState && spotifyState.track_window}
                <img
                    src={spotifyState.track_window.current_track.album.images[1]
                        .url}
                    alt={spotifyState.track_window.current_track.album.name}
                />
                <div>
                    <div class="text-lg font-bold">
                        {spotifyState.track_window.current_track.name}
                    </div>
                    <div>
                        {#each spotifyState.track_window.current_track.artists as artist}
                            <div>{artist.name}</div>
                        {/each} 
                    </div>
                </div>
                <div class="basis-3/4">
                    <progress
                        class="w-full h-1"
                        max={spotifyState.track_window.current_track
                            .duration_ms}
                    />
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .OrSDI {
        background-color: rgba(223, 223, 223, 0.753);
    }
</style>
