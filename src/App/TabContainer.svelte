<script lang="ts">
    import { Tab } from "../lib/TabStore";
    import { fade } from "svelte/transition";

    $: tab = $Tab;
</script>

{#if tab}
    {#await tab then tab_obj}
        <div class="overflow-y-auto overflow-x-hidden " id="tabContainer">
            {#if tab_obj["TAB"] === "Tab not found."}
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
                <div in:fade={{ duration: 700 }}>
                    <div class="flex justify-center gap-2 m-6">
                        <a
                            target="_blank"
                            class="btn btn-warning"
                            href={tab_obj["URL"]}>View on ultimate guitar</a
                        >
                        <!--
                        <div class="btn btn-outline btn-error">
                            Report Wrong Tab
                        </div>
                    -->
                    </div>

                    <div class="flex justify-center mb-10">
                        {@html tab_obj["TAB"]}
                    </div>
                </div>
            {/if}
        </div>
    {/await}
{/if}
