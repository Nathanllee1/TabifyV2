<script lang="ts">
    import { Tab } from "../lib/TabStore";
    import HelpCard from "./Help/HelpCard.svelte";
    import HelpModal from "./Help/HelpModal.svelte";
    import Link from "./Link.svelte";
    import ProfileMenu from "./ProfileMenu.svelte";
    import SearchBar from "./SearchBar.svelte";

</script>

<div class="navbar bg-base-200 justify-between">
    <div>
        <div class="text-xl ml-3 font-bold pr-5 hidden lg:block">Tabify</div>
        <div class="flex gap-4">
            <Link linkName="Explore" href="explore" />
            <Link linkName="Jam" href="main" />
            <!--
            {#if ($Tab).length !== 0}
            <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
            {/if}
            -->
        </div>
    </div>
    <SearchBar />

    <div>
        <label
            for="help-modal"
            class="btn btn-outline btn-info hidden lg:inline-flex">Help</label
        >
        <ProfileMenu />
    </div>
</div>

<HelpModal />

<style>
    /* override daisyui */
    .navbar {
        @apply min-h-fit;
    }
</style>
