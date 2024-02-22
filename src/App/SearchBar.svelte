<script lang="ts">
    import { push, querystring, replace } from "svelte-spa-router";
    import { buildURLWithParams, clickOutside, getHeaders, spotifyRequest } from "../lib/utils";
    import HelpTooltip from "./HelpTooltip.svelte";

    let query = (new URLSearchParams($querystring)).get('q');
    async function searchSpotify() {

        replace(`/search?q=${query}`)

       
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
            on:click={() => {}}
        />
    </div>
    <div class="hidden lg:block">
        <HelpTooltip message="Quickly play and queue songs" />

    </div>
    
</div>
