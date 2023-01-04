<script lang="ts">
    import { Tab } from "../lib/TabStore";
    import { fade } from "svelte/transition";
    import { transposeStore } from "../lib/TransposeStore";
    import { selectedTab } from "../lib/SelectedTab";
</script>

{#if $Tab}
    {#await $Tab then tab_obj}
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
                    <div class="flex justify-center">
                        <div class="tabs tabs-boxed">
                            {#each tab_obj as tab, i}
                                <div
                                    class="tab {i === $selectedTab
                                        ? 'tab-active'
                                        : ''}"
                                    on:click={() => selectedTab.set(i)}
                                >
                                    Version {i + 1}
                                </div>
                            {/each}
                        </div>
                    </div>

                    <div class="flex justify-center gap-4 m-6 align-middle ">
                        <a
                            target="_blank"
                            class="btn btn-warning self-center"
                            href={tab_obj[$selectedTab].url}
                            >View on ultimate guitar</a
                        >

                        <div
                            class="flex outline-1 outline-double outline-gray-200 rounded-lg p-3 gap-2"
                        >
                            <div
                                class="btn btn-outline btn-sm self-center"
                                title="Transpose Up"
                                on:click={() => transposeStore.increase()}
                            >
                                +
                            </div>
                            <div
                                class="self-center w-6 text-center font-semibold cursor-pointer"
                                title="Reset"
                                on:click={() => transposeStore.reset()}
                            >
                                {$transposeStore.semitones}
                            </div>
                            <div
                                class="btn btn-outline btn-sm self-center"
                                title="Transpose Down"
                                on:click={() => transposeStore.decrease()}
                            >
                                -
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-center mb-10 ">
                        <div class="text-[10px]  md:text-[14px] overflow-auto ml-2">
                            {@html tab_obj[$selectedTab].chords}
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {/await}
{/if}
