<script lang="ts">
    import Router from "svelte-spa-router";

    // various stores
    import { AppStore } from "../lib/AppStore";
    import { profile } from "../lib/Profile";

    import Controls from "./Controls.svelte";
    import NavBar from "./NavBar.svelte";
    import Profile from "./Profile/Profile.svelte";
    import TabContainer from "./Jam/TabContainer.svelte";

    import Tutorial from "./Tutorial.svelte";
    import Reconnect from "./Reconnect.svelte";
    import Explore from "./Explore/Explore.svelte";
    import Search from "./Search/Search.svelte";
    import Artist from "./Search/Artist/Artist.svelte";
    import Album from "./Search/Album/Album.svelte";
    export const routes = {
        "/": Explore,
        "/jam": TabContainer,
        "/profile": Profile,
        "/search": Search,
        "/artist/:name": Artist,
        "/album/:id": Album
    };
    profile.init();
</script>

<div class="flex flex-col min-h-screen max-h-screen">
    {#if !$AppStore.canSwitch}
        <Tutorial />
    {/if}

    {#if !$AppStore.connected}
        <Reconnect />
    {/if}

    <NavBar />


    <Router {routes} />

    <Controls />
</div>
