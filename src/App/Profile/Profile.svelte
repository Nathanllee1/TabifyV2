<script lang="ts">
    import Icon from "@iconify/svelte";
    import Loading from "../../Loading.svelte";
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import Song from "./Song.svelte";
    import { profile } from "../../lib/Profile";
    import { push } from "svelte-spa-router";
</script>

<div class="flex justify-center p-8 overflow-y-auto">
    {#if $profile}
        <div class="w-5/6 max-w-screen-sm align-middle flex-1">
            <div class="flex mb-9 justify-between">
                <div class="text-5xl">Profile</div>
                <button
                    class="btn btn-circle btn-ghost cursor-pointer self-center"
                    on:click={() => {
                        push("/jam")
                    }}
                >
                    <Icon
                        icon="ant-design:close-outlined"
                        style="font-size:25px;"
                    />
                </button>
            </div>

            <div class="mb-14">
                <div class="divider" />

                <div class="stats shadow" in:fly>
                    <div class="stat">
                        <div class="stat-title">Total Tabs Played</div>
                        <div class="stat-value text-primary">{$profile.songs}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-title">Number of Tabify Sessions</div>
                        <div class="stat-value text-secondary">
                            {$profile.sessions}
                        </div>
                    </div>
                </div>

                <h1 class="text-3xl mt-14 mb-4">Your Top Songs</h1>
                <div class="flex flex-wrap gap-4">
                    {#each $profile.topTen as song}
                        <Song songId={song} />
                    {/each}
                </div>
            </div>
            <!--
            <div class="text-3xl">Preferences</div>
            <div class="divider" />
            <div>
                
                <div class="form-control">
                    <label class="label cursor-pointer">
                        <span class="label-text">Dark Mode</span>
                        <input type="checkbox" class="toggle" checked />
                    </label>
                </div>
                <div class="flex align-middle justify-between p-[0.25rem]">
                    <span class="label-text self-center"
                        >Difficulty Preference</span
                    >
                    <select class="select select-bordered w-full max-w-xs">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                </div>
            </div>
        -->
        </div>
    {:else}
        <Loading />
    {/if}
</div>
