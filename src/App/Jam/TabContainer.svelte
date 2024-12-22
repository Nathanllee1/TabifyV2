<script lang="ts">
    import { Tab } from "../../lib/TabStore";
    import { transposeStore } from "../../lib/TransposeStore";
    import { selectedTab } from "../../lib/SelectedTab";
    import Loading from "../../Loading.svelte";
    import HelpTooltip from "../HelpTooltip.svelte";
    import { SpotifyState } from "../../lib/SpotifyStateStore";
    import { get } from "svelte/store";
    import Recommender from "../Recommender/Recommender.svelte";

    // Log the tab in history
    Tab.subscribe(async (tab) => {
        if (!tab) return;
        await fetch(
            `/api/history?song_id=${
                get(SpotifyState).track_window.current_track.id
            }&tab_returned=${(await tab).length === 0 ? "f" : "t"}`,
        );
    });
</script>

{#if $Tab}
    {#await $Tab}
        <Loading />
    {:then tab_obj}
        <div class="overflow-y-auto lg:overflow-x-hidden" id="tabContainer">
            {#if tab_obj.length === 0}
                <div class="flex justify-center align-middle">
                    <div class="text-center card max-w-lg">
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
                                target="_blank"
                                href="https://www.ultimate-guitar.com/contribution/submit/tabs?app_utm_campaign=top_menu&app_utm_content=button&app_utm_medium=internal&app_utm_source=ug&app_utm_term=publish"
                                >Ultimate Guitar!</a
                            >
                        </div>
                    </div>
                </div>
            {:else}
                <div>
                    <br />
                    {#if tab_obj.length > 1}
                        <div class="flex justify-center gap-2">
                            <div class="tabs tabs-boxed">
                                {#each tab_obj as tab, i}
                                    <button
                                        class="tab {i === $selectedTab
                                            ? 'tab-active'
                                            : ''}"
                                        on:click={() => selectedTab.set(i)}
                                    >
                                        Version {i + 1}
                                    </button>
                                {/each}
                            </div>
                            <HelpTooltip
                                message="Each version is a different user submitted tab on Ultimate Guitar. Switch between them to see which version you like the most"
                                location="bottom"
                            />
                        </div>
                    {/if}

                    <div class="flex justify-center gap-4 m-6 align-middle">
                        <a
                            target="_blank"
                            class="btn btn-warning self-center"
                            href={tab_obj[$selectedTab].url}
                            >View on ultimate guitar</a
                        >

                        <div
                            class="flex flex-col outline-1 outline-double outline-gray-200 rounded-lg p-3"
                        >
                            <span class="flex gap-1 align-middle mb-1">
                                <p class="self-center">Transpose tab</p>
                            </span>

                            <div class="flex gap-2">
                                <button
                                    class="btn btn-outline btn-sm self-center"
                                    title="Transpose Down"
                                    on:click={() => transposeStore.decrease()}
                                >
                                    -
                                </button>
                                <button
                                    class="self-center w-6 text-center font-semibold cursor-pointer"
                                    title="Reset"
                                    on:click={() => transposeStore.reset()}
                                >
                                    {$transposeStore.semitones}
                                </button>
                                <button
                                    class="btn btn-outline btn-sm self-center"
                                    title="Transpose Up"
                                    on:click={() => transposeStore.increase()}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-center mb-10">
                        <div class=" overflow-auto ml-2">
                            {@html tab_obj[$selectedTab].chords}
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {/await}
{:else}

    <div class="text-4xl p-10">
        Select a song by using the search or in <a href="/#/" class="link">Explore</a>
    </div>


{/if}

<style>
    :global(._3rlxz) {
        font-size: 20px;
    }
</style>
