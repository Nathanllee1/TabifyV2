<script lang="ts">
    import { FastAverageColor } from "fast-average-color";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    export let imgSrc;
    export let title;

    export let top = false;

    export let greyedOut = false;

    let color;

    onMount(async () => {
        color = (await new FastAverageColor().getColorAsync(imgSrc)).hex;
    });
</script>

<div
    class={`card ${top ? "w-[350px]" : "w-56"} ${
        greyedOut ? "grayscale opacity-40 backdrop-brightness-50" : ""
    } hidden lg:block text-left rounded-lg bg-base-300 ease-in-out delay-100 transition hover:scale-105 border-2`}
    style={`border-color: ${color}`}
    in:fade
>
    <figure>
        <img src={imgSrc} alt={title} />
    </figure>
    <div class="card-body">
        <slot class="text-left" name="label" />
        <div class="tooltip" data-tip={title}>
            <div class="card-title truncate text-ellipsis">{title}</div>
        </div>
        <slot />
    </div>
</div>

<div class="grow">
    <div class={` lg:hidden self-stretch grow flex `}>
        <div class="pr-4">
            <img src={imgSrc} width="70px" height="70px" alt={title} />
        </div>
        <div>
            <div>
                <div class="mb-2 text-left font-bold">{title}</div>
                <div class="text-left">
                    <slot />
                </div>
            </div>
        </div>

        <div class="ml-auto">
            <slot class="text-left" name="label" />
        </div>
    </div>
</div>
