<script lang="ts">
    import { onMount } from "svelte";

    // various stores
    import { AppStore } from "../lib/AppStore";
    import { AppPage } from "./AppPage";
    import { profile } from "../lib/Profile";

    import Controls from "./Controls.svelte";
    import NavBar from "./NavBar.svelte";
    import Profile from "./Profile.svelte";
    import TabContainer from "./TabContainer.svelte";

    import Tutorial from "./Tutorial.svelte";
    import Reconnect from "./Reconnect.svelte";


    profile.init();

</script>

<div class="flex flex-col min-h-screen max-h-screen ">
    {#if !$AppStore.canSwitch}
        <Tutorial />
    {/if}

    {#if !$AppStore.connected}
        <Reconnect />
    {/if}

    <NavBar />

    {#if $AppPage === "main"}
        <TabContainer />
    {:else}
        <Profile />
    {/if}
    <Controls />
</div>