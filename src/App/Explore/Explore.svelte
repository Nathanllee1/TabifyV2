<script lang="ts">
    import { yourExploreStore } from "./Explore";
    import Content from "./Content.svelte";
</script>

<div class="flex justify-center overflow-y-auto p-6">
    <div class=" p-4 ">
        <div class="flex gap-8 flex-wrap pb-4 justify-center">
            {#if $yourExploreStore && $yourExploreStore.length !== 0}
                {#each $yourExploreStore as playlist}
                    <Content trackObj={playlist} />
                {/each}
            {:else}
                {#each Array(12).fill(0) as item}
                    <div
                        class="animate-pulse w-[350px] h-[320px] bg-base-200 rounded-lg"
                    />
                {/each}
            {/if}
        </div>
    </div>
</div>
