<script lang="ts">
    import Carousel from "svelte-carousel";
    import Icon from "@iconify/svelte";
    import Content from "./Content.svelte";
    import type { ExploreTrack } from "./Explore";

    export let title: string;
    export let eyebrow: string;
    export let tracks: ExploreTrack[] = [];

    let windowWidth = 1200;

    $: particlesToShow = Math.min(
        tracks.length || 1,
        windowWidth >= 1280 ? 4 : windowWidth >= 920 ? 3 : windowWidth >= 640 ? 2 : 1
    );
</script>

<svelte:window bind:innerWidth={windowWidth} />

{#if tracks.length > 0}
    <section class="w-full">
        <div class="mb-3 flex items-end justify-between gap-4">
            <div>
                <div class="text-sm font-bold uppercase text-primary">{eyebrow}</div>
                <h2 class="text-3xl font-bold">{title}</h2>
            </div>
            <div class="badge badge-neutral">{tracks.length} songs</div>
        </div>

        <Carousel
            arrows={tracks.length > particlesToShow}
            dots={tracks.length > particlesToShow}
            infinite={tracks.length > particlesToShow}
            particlesToShow={particlesToShow}
            particlesToScroll={particlesToShow}
            duration={350}
        >
            <div slot="prev" let:showPrevPage class="flex items-center pr-2">
                <button
                    class="btn btn-circle btn-sm"
                    aria-label={`Previous ${title}`}
                    on:click={showPrevPage}
                >
                    <Icon icon="tabler:chevron-left" style="font-size:22px;" />
                </button>
            </div>

            <div slot="next" let:showNextPage class="flex items-center pl-2">
                <button
                    class="btn btn-circle btn-sm"
                    aria-label={`Next ${title}`}
                    on:click={showNextPage}
                >
                    <Icon icon="tabler:chevron-right" style="font-size:22px;" />
                </button>
            </div>

            {#each tracks as trackObj (trackObj.track.id)}
                <Content {trackObj} />
            {/each}
        </Carousel>
    </section>
{/if}

<style>
    :global(.sc-carousel-dots__container) {
        margin-top: 0.5rem;
    }
</style>
