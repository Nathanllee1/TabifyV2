<script lang="ts">
    // various stores
    import { AppStore } from "../lib/AppStore";
    import { AppPage } from "../lib/AppPage";
    import { profile } from "../lib/Profile";

    import Controls from "./Controls.svelte";
    import NavBar from "./NavBar.svelte";
    import Profile from "./Profile/Profile.svelte";
    import TabContainer from "./TabContainer.svelte";

    import Tutorial from "./Tutorial.svelte";
    import Reconnect from "./Reconnect.svelte";
    import Explore from "./Explore/Explore.svelte";

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
    {:else if $AppPage === "profile"}
        <Profile />
    {:else}
        <Explore />
    {/if}
        
    <Controls />
</div>