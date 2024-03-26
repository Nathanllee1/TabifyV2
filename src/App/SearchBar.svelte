<script lang="ts">
    import { querystring, replace } from "svelte-spa-router";
    import HelpTooltip from "./HelpTooltip.svelte";

    let query = new URLSearchParams($querystring).get("q");
    async function searchSpotify() {
        if (query.length < 2) {
            return;
        }

        replace(`/search?q=${query}`);
    }
</script>

<div class="flex gap-2">
    <div class="self-center">
        <input
            type="text"
            placeholder="Search Spotify"
            class="input w-full max-w-5xl"
            bind:value={query}
            on:input={() => searchSpotify()}
            on:click={() => searchSpotify()}
        />
    </div>
    <div class="hidden lg:block">
        <HelpTooltip message="Quickly play and queue songs" />
    </div>
</div>
