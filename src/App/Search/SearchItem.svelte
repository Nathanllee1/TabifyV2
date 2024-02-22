<script lang="ts">
    import { FastAverageColor } from "fast-average-color";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    export let imgSrc;
    export let title;

    export let top = false;

    let color;

    onMount(async () => {
        color = (
            await new FastAverageColor().getColorAsync(
                imgSrc,
            )
        ).hex;
    })
</script>

<div
    class={`card ${top ? "w-[350px]" : "w-56"} rounded-lg bg-base-300 ease-in-out delay-100 transition hover:scale-105 border-2`}
    style={`border-color: ${color}`}
    in:fade
>
    <figure>
        <img src={imgSrc} alt={title} />
    </figure>
    <div class="card-body">
        <slot class="text-left" name="label" />

        <div class="card-title truncate text-ellipsis">{title}</div>
        <slot />
    </div>
</div>
