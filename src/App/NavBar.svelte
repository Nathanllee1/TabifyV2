<script lang="ts">
    import { Tab } from "../lib/TabStore";
    import HelpCard from "./Help/HelpCard.svelte";
    import HelpModal from "./Help/HelpModal.svelte";
    import Link from "./Link.svelte";
    import ProfileMenu from "./ProfileMenu.svelte";
    import SearchBar from "./SearchBar.svelte";
    // @ts-ignore
    import { location } from "svelte-spa-router";

    let tabs = [];

    Tab.subscribe(async (tab) => {
        tabs = await tab;
    });
</script>

<div class="navbar bg-base-200 justify-between">
    <div>
        <div class="text-xl ml-3 font-bold pr-5 hidden lg:block">Tabify</div>
        <div class="flex gap-4">
            <Link linkName="Explore" href="" />
            <div class="indicator">
                <a
                    class={`hover:link self-center pr-2 ${
                        $location === `/jam`
                            ? "font-bold badge badge-secondary"
                            : ""
                    }`}
                    href={"/#/jam"}>Jam</a
                >

                {#if tabs.length !== 0}
                    <span
                        class="indicator-item badge badge-xs badge-primary animate-pulse"
                    ></span>
                {/if}
            </div>
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
